package com.moneymanager.backend.service;

import com.moneymanager.backend.dto.*;
import com.moneymanager.backend.model.User;
import com.moneymanager.backend.repository.UserRepository;
import com.moneymanager.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public void register(RegisterRequest req) {

        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPasswordHash(encoder.encode(req.getPassword()));

        userRepo.save(u);
    }

    public AuthResponse login(LoginRequest req) {

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId());
        return new AuthResponse(token);
    }
}
