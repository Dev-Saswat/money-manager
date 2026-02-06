package com.moneymanager.backend.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "accounts")
public class Account {

    @Id
    private String id;

    private String userId;
    private String name;
    private double balance;
}
