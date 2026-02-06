package com.moneymanager.backend.controller;

import com.moneymanager.backend.dto.TransactionRequest;
import com.moneymanager.backend.model.Transaction;
import com.moneymanager.backend.service.TransactionService;
import com.moneymanager.backend.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Page;
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
        if (auth == null || !auth.startsWith("Bearer "))
            throw new RuntimeException("Missing token");

        return jwtService.extractUserId(auth.substring(7));
    }

    // CREATE
    @PostMapping
    public Transaction create(
            @RequestBody TransactionRequest request,
            HttpServletRequest httpRequest
    ) {
        return service.create(
                extractUserId(httpRequest),
                request
        );
    }

    // LIST
    @GetMapping
    public List<Transaction> list(HttpServletRequest request) {
        return service.getUserTransactions(
                extractUserId(request)
        );
    }

    // UPDATE
    @PutMapping("/{id}")
    public Transaction update(
            @PathVariable String id,
            @RequestBody TransactionRequest request,
            HttpServletRequest httpRequest
    ) {
        return service.update(
                extractUserId(httpRequest),
                id,
                request
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable String id,
            HttpServletRequest request
    ) {
        service.delete(extractUserId(request), id);
        return ResponseEntity.ok().build();
    }

    // RESTORE
    @PostMapping("/{id}/restore")
    public ResponseEntity<?> restore(
            @PathVariable String id,
            HttpServletRequest request
    ) {
        service.restore(extractUserId(request), id);
        return ResponseEntity.ok().build();
    }

    // TRASH
    @GetMapping("/trash")
    public List<Transaction> trash(HttpServletRequest request) {
        return service.getDeleted(
                extractUserId(request)
        );
    }

    // TOTAL SUMMARY
    @GetMapping("/summary")
    public Map<String, Double> summary(HttpServletRequest request) {
        return service.getSummary(
                extractUserId(request)
        );
    }

    // WEEK / MONTH / YEAR
    @GetMapping("/summary/{period}")
    public Map<String, Double> summaryByPeriod(
            @PathVariable String period,
            HttpServletRequest request
    ) {
        return service.getSummaryByPeriod(
                extractUserId(request),
                period
        );
    }

    // DIVISION FILTER
    @GetMapping("/division/{division}")
    public List<Transaction> byDivision(
            @PathVariable String division,
            HttpServletRequest request
    ) {
        return service.getByDivision(
                extractUserId(request),
                division
        );
    }

    // DATE RANGE
    @GetMapping("/range")
    public List<Transaction> range(
            @RequestParam String from,
            @RequestParam String to,
            HttpServletRequest request
    ) {
        return service.betweenDates(
                extractUserId(request),
                from,
                to
        );
    }

    // CATEGORY SUMMARY
    @GetMapping("/categories")
    public Map<String, Double> categories(
            HttpServletRequest request
    ) {
        return service.categorySummary(
                extractUserId(request)
        );
    }

    // PAGINATION
    @GetMapping("/page")
    public Page<Transaction> paged(
            @RequestParam int page,
            @RequestParam int size,
            HttpServletRequest request
    ) {
        return service.getPaged(
                extractUserId(request),
                page,
                size
        );
    }
}
