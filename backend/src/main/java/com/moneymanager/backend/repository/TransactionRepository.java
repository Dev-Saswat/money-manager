package com.moneymanager.backend.repository;

import com.moneymanager.backend.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepository
        extends MongoRepository<Transaction, String> {

    List<Transaction> findByGroupId(String groupId);

    List<Transaction> findByUserIdAndDeletedFalse(String userId);

    List<Transaction> findByGroupIdAndDeletedFalse(String groupId);

    List<Transaction> findByUserIdAndDeletedTrue(String userId);

    List<Transaction> findByUserIdAndDivisionAndDeletedFalse(
            String userId,
            String division
    );

    Page<Transaction> findByUserIdAndDeletedFalse(
            String userId,
            Pageable pageable
    );
}
