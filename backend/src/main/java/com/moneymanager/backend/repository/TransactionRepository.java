package com.moneymanager.backend.repository;

import com.moneymanager.backend.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepository
        extends MongoRepository<Transaction, String> {

    List<Transaction> findByGroupId(String groupId);
    List<Transaction> findByUserId(String userId);
    List<Transaction> findByUserIdAndDeletedFalse(String userId);
    List<Transaction> findByGroupIdAndDeletedFalse(String groupId);
    List<Transaction> findByUserIdAndDeletedTrue(String userId);

}
