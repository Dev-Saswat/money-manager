package com.moneymanager.backend.service;

import com.moneymanager.backend.model.Account;
import com.moneymanager.backend.model.Transaction;
import com.moneymanager.backend.repository.AccountRepository;
import com.moneymanager.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository repository;
    private final TransactionRepository transactionRepo;


    public AccountService(AccountRepository repository, TransactionRepository transactionRepo) {
        this.repository = repository;
        this.transactionRepo = transactionRepo;
    }

    public Account create(String userId, String name) {

        Account acc = new Account();
        acc.setUserId(userId);    // ⭐ VERY IMPORTANT
        acc.setName(name);
        acc.setBalance(0);

        return repository.save(acc);
    }

    public List<Account> getUserAccounts(String userId) {
        return repository.findByUserId(userId);
    }

    public void transfer(String userId,
                         String fromId,
                         String toId,
                         double amount) {

        String groupId = java.util.UUID.randomUUID().toString();
        Account from = repository.findById(fromId)
                .orElseThrow(() -> new RuntimeException("From account not found"));

        Account to = repository.findById(toId)
                .orElseThrow(() -> new RuntimeException("To account not found"));

        if (!from.getUserId().equals(userId)
                || !to.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (from.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // update balances
        from.setBalance(from.getBalance() - amount);
        to.setBalance(to.getBalance() + amount);

        repository.save(from);
        repository.save(to);

        // transfer OUT
        Transaction outTx = new Transaction(
                userId,
                "transfer",
                "OUT",
                amount,
                "Transfer",
                "Transfer to " + to.getName(),
                fromId
        );

        // transfer IN
        Transaction inTx = new Transaction(
                userId,
                "transfer",
                "IN",
                amount,
                "Transfer",
                "Transfer from " + from.getName(),
                toId
        );
        outTx.setGroupId(groupId);
        inTx.setGroupId(groupId);

        transactionRepo.save(outTx);
        transactionRepo.save(inTx);
    }

}
