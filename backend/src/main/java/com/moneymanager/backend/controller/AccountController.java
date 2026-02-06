package com.moneymanager.backend.controller;

import com.moneymanager.backend.model.Account;
import com.moneymanager.backend.security.JwtService;
import com.moneymanager.backend.service.AccountService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
public class AccountController {

    private final AccountService service;
    private final JwtService jwtService;

    public AccountController(AccountService service,
                             JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }

    private String extractUserId(HttpServletRequest request) {

        String auth = request.getHeader("Authorization");

        if (auth == null || !auth.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }

        String token = auth.substring(7);
        return jwtService.extractUserId(token);
    }


    @PostMapping
    public ResponseEntity<Account> create(
            @RequestParam String name,
            HttpServletRequest request
    ) {
        String userId = extractUserId(request);
        return ResponseEntity.ok(
                service.create(userId, name)
        );
    }

    @GetMapping
    public ResponseEntity<List<Account>> list(
            HttpServletRequest request
    ) {
        String userId = extractUserId(request);
        return ResponseEntity.ok(
                service.getUserAccounts(userId)
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(
            @RequestParam String fromId,
            @RequestParam String toId,
            @RequestParam double amount,
            HttpServletRequest request
    ) {
        String userId = extractUserId(request);
        service.transfer(userId, fromId, toId, amount);
        return ResponseEntity.ok().build();
    }

}
