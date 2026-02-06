package com.moneymanager.backend.controller;

import com.moneymanager.backend.dto.TransactionRequest;
import com.moneymanager.backend.model.Transaction;
import com.moneymanager.backend.service.TransactionService;
import com.moneymanager.backend.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService service;
    private final JwtService jwtService;

    public TransactionController(TransactionService service,
                                 JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService;
    }

    private String extractUserId(HttpServletRequest request) {
        String auth = request.getHeader("Authorization");
        String token = auth.substring(7);
        return jwtService.extractUserId(token);
    }

    @PostMapping
    public ResponseEntity<Transaction> create(
            @RequestBody TransactionRequest request,
            HttpServletRequest httpRequest
    ) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(
                service.create(userId, request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> list(
            HttpServletRequest httpRequest
    ) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(
                service.getUserTransactions(userId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(
            @PathVariable String id,
            @RequestBody TransactionRequest request,
            HttpServletRequest httpRequest
    ) {
        String userId = extractUserId(httpRequest);
        return ResponseEntity.ok(
                service.update(userId, id, request)
        );
    }

    @GetMapping("/summary")
    public Map<String, Double> summary(HttpServletRequest request) {
        String userId = extractUserId(request);
        return service.getSummary(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable String id,
            HttpServletRequest request
    ) {
        String userId = extractUserId(request);
        service.delete(userId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trash")
    public ResponseEntity<List<Transaction>> trash(
            HttpServletRequest request
    ) {
        String userId = extractUserId(request);
        return ResponseEntity.ok(
                service.getDeleted(userId)
        );
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<?> restore(
            @PathVariable String id,
            HttpServletRequest request
    ) {
        String userId = extractUserId(request);
        service.restore(userId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/report")
    public ResponseEntity<?> report(
            @RequestParam String from,
            @RequestParam String to,
            HttpServletRequest request
    ) {
        String userId = extractUserId(request);
        return ResponseEntity.ok(
                service.getReport(userId, from, to)
        );
    }



}
