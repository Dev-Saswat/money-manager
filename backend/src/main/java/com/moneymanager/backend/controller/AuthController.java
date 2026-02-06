package com.moneymanager.backend.controller;

import com.moneymanager.backend.dto.*;
import com.moneymanager.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest req) {

        authService.register(req);
        return ResponseEntity.status(201).body("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest req) {

        return ResponseEntity.ok(authService.login(req));
    }
}
