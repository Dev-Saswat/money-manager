package com.moneymanager.backend.service;

import com.moneymanager.backend.dto.TransactionRequest;
import com.moneymanager.backend.model.Transaction;
import com.moneymanager.backend.model.Account;
import com.moneymanager.backend.repository.TransactionRepository;
import com.moneymanager.backend.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    private final TransactionRepository repo;
    private final AccountRepository accountRepo;

    public TransactionService(TransactionRepository repo,
                              AccountRepository accountRepo) {
        this.repo = repo;
        this.accountRepo = accountRepo;
    }

    public Transaction create(String userId, TransactionRequest request) {

        // 1️⃣ Load account
        Account account = accountRepo
                .findById(request.getAccountId())
                .orElseThrow(() ->
                        new RuntimeException("Account not found"));

        // 2️⃣ Ownership check
        if (!account.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized account");
        }

        // 3️⃣ Balance rules
        if (request.getType().equals("expense")
                && account.getBalance() < request.getAmount()) {
            throw new RuntimeException("Insufficient balance");
        }

        // 4️⃣ Update account balance
        if (request.getType().equals("income")) {
            account.setBalance(
                    account.getBalance() + request.getAmount()
            );
        } else {
            account.setBalance(
                    account.getBalance() - request.getAmount()
            );
        }

        accountRepo.save(account);

        // 5️⃣ Save transaction
        Transaction tx = new Transaction(
                userId,
                request.getType(),
                "IN",
                request.getAmount(),
                request.getCategory(),
                request.getDescription(),
                request.getAccountId()
        );

        return repo.save(tx);
    }

    public List<Transaction> getUserTransactions(String userId) {
        return repo.findByUserIdAndDeletedFalse(userId);
    }

    public Transaction update(String userId,
                              String txId,
                              TransactionRequest request) {

        Transaction tx = repo.findById(txId)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!tx.getUserId().equals(userId))
            throw new RuntimeException("Unauthorized");

        long minutes = java.time.Duration
                .between(tx.getCreatedAt(), java.time.LocalDateTime.now())
                .toMinutes();

        if (minutes > 720)
            throw new RuntimeException("Edit window expired");

        // ============================
        // TRANSFER UPDATE
        // ============================
        if (tx.getType().equals("transfer")) {

            List<Transaction> pair =
                    repo.findByGroupId(tx.getGroupId());

            for (Transaction t : pair) {

                Account acc = accountRepo
                        .findById(t.getAccountId())
                        .orElseThrow();

                // reverse old
                if (t.getDirection().equals("OUT")) {
                    acc.setBalance(acc.getBalance() + t.getAmount());
                } else {
                    acc.setBalance(acc.getBalance() - t.getAmount());
                }

                // apply new
                if (t.getDirection().equals("OUT")) {
                    acc.setBalance(acc.getBalance() - request.getAmount());
                } else {
                    acc.setBalance(acc.getBalance() + request.getAmount());
                }

                t.setAmount(request.getAmount());

                accountRepo.save(acc);
                repo.save(t);
            }

            return tx;
        }

        // ============================
        // INCOME / EXPENSE UPDATE
        // ============================

        Account account = accountRepo
                .findById(tx.getAccountId())
                .orElseThrow();

        // reverse old
        if (tx.getType().equals("income")) {
            account.setBalance(account.getBalance() - tx.getAmount());
        } else {
            account.setBalance(account.getBalance() + tx.getAmount());
        }

        // apply new
        if (tx.getType().equals("income")) {
            account.setBalance(account.getBalance() + request.getAmount());
        } else {
            account.setBalance(account.getBalance() - request.getAmount());
        }

        tx.setAmount(request.getAmount());
        tx.setCategory(request.getCategory());
        tx.setDescription(request.getDescription());

        accountRepo.save(account);
        return repo.save(tx);
    }



    public Map<String, Double> getSummary(String userId) {

        List<Transaction> list = repo.findByUserIdAndDeletedFalse(userId);

        double income = 0;
        double expense = 0;

        for (Transaction t : list) {
            if (t.getType().equals("income")) {
                income += t.getAmount();
            }
            else if (t.getType().equals("expense")) {
                expense += t.getAmount();
            }
            // transfer is intentionally ignored
        }


        Map<String, Double> result = new HashMap<>();
        result.put("income", income);
        result.put("expense", expense);
        result.put("balance", income - expense);

        return result;
    }

    public void delete(String userId, String id) {

        Transaction tx = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!tx.getUserId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        // If transfer → delete both sides
        if (tx.getType().equals("transfer") && tx.getGroupId() != null) {

            List<Transaction> pair =
                    repo.findByGroupIdAndDeletedFalse(tx.getGroupId());

            for (Transaction t : pair) {
                deleteSingle(t);
            }
            return;
        }

        deleteSingle(tx);
    }

    private void deleteSingle(Transaction tx) {

        Account account = accountRepo.findById(tx.getAccountId())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (tx.getType().equals("transfer")) {

            if (tx.getDirection().equals("OUT")) {
                account.setBalance(account.getBalance() + tx.getAmount());
            } else {
                account.setBalance(account.getBalance() - tx.getAmount());
            }

        } else if (tx.getType().equals("income")) {

            account.setBalance(account.getBalance() - tx.getAmount());

        } else {

            account.setBalance(account.getBalance() + tx.getAmount());
        }

        accountRepo.save(account);
        tx.setDeleted(true);
        repo.save(tx);

    }

    public void restore(String userId, String id) {

        Transaction tx = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        if (!tx.getUserId().equals(userId))
            throw new RuntimeException("Forbidden");

        if (!tx.isDeleted()) return;

        // ===========================
        // TRANSFER RESTORE
        // ===========================
        if (tx.getType().equals("transfer") && tx.getGroupId() != null) {

            List<Transaction> pair =
                    repo.findByGroupId(tx.getGroupId());

            for (Transaction t : pair) {

                if (!t.isDeleted()) continue;

                Account acc = accountRepo
                        .findById(t.getAccountId())
                        .orElseThrow();

                if (t.getDirection().equals("OUT")) {
                    acc.setBalance(acc.getBalance() - t.getAmount());
                } else {
                    acc.setBalance(acc.getBalance() + t.getAmount());
                }

                t.setDeleted(false);
                accountRepo.save(acc);
                repo.save(t);
            }

            return;
        }

        // ===========================
        // INCOME / EXPENSE RESTORE
        // ===========================

        Account acc = accountRepo
                .findById(tx.getAccountId())
                .orElseThrow();

        if (tx.getType().equals("income")) {
            acc.setBalance(acc.getBalance() + tx.getAmount());
        }
        else {
            acc.setBalance(acc.getBalance() - tx.getAmount());
        }

        tx.setDeleted(false);
        accountRepo.save(acc);
        repo.save(tx);
    }

    public List<Transaction> getDeleted(String userId) {
        return repo.findByUserIdAndDeletedTrue(userId);
    }

    public Map<String, Object> getReport(
            String userId,
            String from,
            String to
    ) {

        LocalDate start = LocalDate.parse(from);
        LocalDate end = LocalDate.parse(to);

        List<Transaction> list =
                repo.findByUserIdAndDeletedFalse(userId);

        double income = 0;
        double expense = 0;

        Map<String, Double> categoryMap = new HashMap<>();

        for (Transaction t : list) {

            LocalDate txDate =
                    t.getCreatedAt().toLocalDate();

            if (txDate.isBefore(start) || txDate.isAfter(end))
                continue;

            if (t.getType().equals("income")) {
                income += t.getAmount();
            }

            else if (t.getType().equals("expense")) {
                expense += t.getAmount();

                categoryMap.put(
                        t.getCategory(),
                        categoryMap.getOrDefault(
                                t.getCategory(), 0.0
                        ) + t.getAmount()
                );
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("income", income);
        result.put("expense", expense);
        result.put("balance", income - expense);
        result.put("categories", categoryMap);

        return result;
    }


}
