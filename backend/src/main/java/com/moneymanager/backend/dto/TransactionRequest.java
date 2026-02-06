package com.moneymanager.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransactionRequest {
    private String type;
    private double amount;
    private String category;
    private String description;
    private String accountId;
}

