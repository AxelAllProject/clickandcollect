package com.clickandcollect.backend.auth;

import com.clickandcollect.backend.auth.service.JwtService;
import com.clickandcollect.backend.user.Role;
import com.clickandcollect.backend.user.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Date;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Tests unitaires de la generation / verification des JWT.
 */
class JwtServiceTest {

    private static final String SECRET = "CleDeTestUniquementPourLaSuiteDeTestsClickAndCollect1234567890";
    private static final String AUTRE_SECRET = "UneToutAutreCleDeSignatureQuiNaRienAVoirAvecLaPremiere98765";

    private JwtService jwtService;

    private static User utilisateur(Long id, String email, Role role) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setRole(role);
        return user;
    }

    private static Key cle(String secret) {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", SECRET);
    }

    @Test
    @DisplayName("Le token genere porte l'email en subject")
    void generateToken_metLEmailEnSubject() {
        String token = jwtService.generateToken(utilisateur(1L, "camille@test.fr", Role.USER));

        assertThat(jwtService.extractUsername(token)).isEqualTo("camille@test.fr");
    }

    @Test
    @DisplayName("Le token genere porte les claims id et role")
    void generateToken_metIdEtRoleDansLesClaims() {
        String token = jwtService.generateToken(utilisateur(42L, "admin@test.fr", Role.ADMIN));

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(cle(SECRET))
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertThat(claims.get("role")).isEqualTo("ADMIN");
        assertThat(((Number) claims.get("id")).longValue()).isEqualTo(42L);
        assertThat(claims.getExpiration()).isAfter(new Date());
    }

    @Test
    @DisplayName("isTokenValid accepte le token de son proprietaire")
    void isTokenValid_vraiPourLeBonUtilisateur() {
        User user = utilisateur(1L, "camille@test.fr", Role.USER);

        assertThat(jwtService.isTokenValid(jwtService.generateToken(user), user)).isTrue();
    }

    @Test
    @DisplayName("isTokenValid refuse le token d'un autre utilisateur")
    void isTokenValid_fauxPourUnAutreUtilisateur() {
        String token = jwtService.generateToken(utilisateur(1L, "camille@test.fr", Role.USER));
        User autre = utilisateur(2L, "mallory@test.fr", Role.USER);

        assertThat(jwtService.isTokenValid(token, autre)).isFalse();
    }

    @Test
    @DisplayName("Un token signe avec une autre cle est rejete")
    void tokenSigneAvecUneAutreCle_estRejete() {
        String tokenForge = Jwts.builder()
                .setClaims(Map.of("role", "ADMIN"))
                .setSubject("mallory@test.fr")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60_000))
                .signWith(cle(AUTRE_SECRET), SignatureAlgorithm.HS256)
                .compact();

        // La signature ne correspond pas : la verification doit echouer, pas passer.
        assertThatThrownBy(() -> jwtService.extractUsername(tokenForge))
                .isInstanceOf(io.jsonwebtoken.security.SignatureException.class);
    }

    @Test
    @DisplayName("Un token expire est rejete")
    void tokenExpire_estRejete() {
        Date passe = new Date(System.currentTimeMillis() - 120_000);
        String tokenExpire = Jwts.builder()
                .setSubject("camille@test.fr")
                .setIssuedAt(passe)
                .setExpiration(new Date(System.currentTimeMillis() - 60_000))
                .signWith(cle(SECRET), SignatureAlgorithm.HS256)
                .compact();

        assertThatThrownBy(() -> jwtService.extractUsername(tokenExpire))
                .isInstanceOf(ExpiredJwtException.class);
    }

    @Test
    @DisplayName("Un token malforme est rejete")
    void tokenMalforme_estRejete() {
        assertThatThrownBy(() -> jwtService.extractUsername("ceci.nest.pas.un.jwt"))
                .isInstanceOf(io.jsonwebtoken.JwtException.class);
    }
}
