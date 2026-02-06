package com.moneymanager.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Setter
@Getter
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    private String userId;
    private String accountId;
    private String type;     // income / expense
    private String direction;  //IN / OUT
    private double amount;
    private String category;
    private String description;
    private LocalDateTime createdAt;
    private String groupId;
    private boolean deleted = false;
    private String division;   // OFFICE or PERSONAL



    public Transaction() {
    }

    public Transaction(String userId,
                       String type,
                       String direction,
                       double amount,
                       String category,
                       String description,
                       String accountId) {
        this.userId = userId;
        this.type = type;
        this.direction = direction;
        this.amount = amount;
        this.category = category;
        this.description = description;
        this.accountId = accountId;
        this.createdAt = LocalDateTime.now();
    }
}