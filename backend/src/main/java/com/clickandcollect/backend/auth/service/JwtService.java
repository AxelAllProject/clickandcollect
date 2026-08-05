package com.clickandcollect.backend.auth.service;

import com.clickandcollect.backend.user.User;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    private java.security.Key getSignInKey(){
        return io.jsonwebtoken.security.Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(User user){
        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
        extraClaims.put("id", user.getId());
        extraClaims.put("role", user.getRole().name());

        return io.jsonwebtoken.Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(user.getEmail())
                .setIssuedAt(new java.util.Date(System.currentTimeMillis()))
                .setExpiration(new java.util.Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return io.jsonwebtoken.Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }


    public boolean isTokenValid(String token, User user) {
        final String username = extractUsername(token);
        return (username.equals(user.getEmail())) && !isTokenExpired(token);
    }


    private boolean isTokenExpired(String token) {
        return io.jsonwebtoken.Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration()
                .before(new java.util.Date());
    }

}
