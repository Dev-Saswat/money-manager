package com.moneymanager.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiry}")
    private long expiry;

    // =========================
    // SIGNING KEY
    // =========================
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    // =========================
    // GENERATE TOKEN
    // =========================
    public String generateToken(String userId) {

        return Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + expiry)
                )
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // =========================
    // EXTRACT ALL CLAIMS
    // =========================
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // =========================
    // EXTRACT USER ID
    // =========================
    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    // =========================
    // VALIDATE TOKEN
    // =========================
    public boolean isTokenValid(String token) {

        try {
            extractAllClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
