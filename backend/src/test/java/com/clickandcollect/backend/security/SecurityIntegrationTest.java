package com.clickandcollect.backend.security;

import com.clickandcollect.backend.auth.service.JwtService;
import com.clickandcollect.backend.user.Role;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.user.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests d'integration de la chaine de securite : filtre JWT + regles d'acces.
 * On passe par de vrais tokens pour couvrir le filtre, pas seulement les annotations.
 *
 * Regle attendue : 401 quand l'appelant n'est pas authentifie, 403 quand il l'est
 * mais n'a pas le droit. Aucun cas ne doit produire de 500.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class SecurityIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private UserRepository userRepository;
    @Autowired private JwtService jwtService;

    @MockitoBean private JavaMailSender javaMailSender;

    private String tokenClient;
    private String tokenAdmin;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        tokenClient = jwtService.generateToken(creerUtilisateur("client@test.fr", Role.USER));
        tokenAdmin = jwtService.generateToken(creerUtilisateur("admin@test.fr", Role.ADMIN));
    }

    private User creerUtilisateur(String email, Role role) {
        User user = new User();
        user.setFirstname("Prenom");
        user.setLastname("Nom");
        user.setEmail(email);
        user.setPassword("$2a$10$peu-importe");
        user.setRole(role);
        return userRepository.save(user);
    }

    @Nested
    @DisplayName("Non authentifie : 401")
    class NonAuthentifies {

        @Test
        @DisplayName("Sans token, tous les endpoints proteges renvoient 401")
        void sansToken_401() throws Exception {
            mockMvc.perform(get("/api/orders")).andExpect(status().isUnauthorized());
            mockMvc.perform(get("/api/cart")).andExpect(status().isUnauthorized());
            mockMvc.perform(get("/api/profile")).andExpect(status().isUnauthorized());
            mockMvc.perform(get("/api/admin/users")).andExpect(status().isUnauthorized());
            mockMvc.perform(get("/api/pickup-slots")).andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Le catalogue produits exige aussi une authentification (anyRequest().authenticated())")
        void catalogue_exigeUneAuthentification() throws Exception {
            mockMvc.perform(get("/api/products")).andExpect(status().isUnauthorized());
            mockMvc.perform(get("/api/products").header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Un header Authorization mal forme n'ouvre aucun acces")
        void headerMalForme_401() throws Exception {
            mockMvc.perform(get("/api/orders").header("Authorization", "n'importe quoi"))
                    .andExpect(status().isUnauthorized());
            mockMvc.perform(get("/api/orders").header("Authorization", "Basic dXNlcjpwYXNz"))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Un token malforme renvoie 401, pas une erreur serveur")
        void tokenMalforme_401() throws Exception {
            mockMvc.perform(get("/api/orders").header("Authorization", "Bearer ceci.nest.pas.un.jwt"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.status").value(401));
        }

        @Test
        @DisplayName("Un token expire renvoie 401, pas une erreur serveur")
        void tokenExpire_401() throws Exception {
            String expire = Jwts.builder()
                    .setSubject("client@test.fr")
                    .setIssuedAt(new Date(System.currentTimeMillis() - 120_000))
                    .setExpiration(new Date(System.currentTimeMillis() - 60_000))
                    .signWith(Keys.hmacShaKeyFor(secretDeTest().getBytes()), SignatureAlgorithm.HS256)
                    .compact();

            mockMvc.perform(get("/api/orders").header("Authorization", "Bearer " + expire))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Un token signe avec une autre cle renvoie 401")
        void tokenMalSigne_401() throws Exception {
            String forge = Jwts.builder()
                    .setClaims(Map.of("role", "ADMIN"))
                    .setSubject("admin@test.fr")
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 60_000))
                    .signWith(Keys.hmacShaKeyFor(
                            "UneToutAutreCleDeSignatureQuiNaRienAVoirAvecLaPremiere98765".getBytes()),
                            SignatureAlgorithm.HS256)
                    .compact();

            mockMvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + forge))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Le token d'un compte supprime ne donne plus acces a rien")
        void tokenDUnCompteSupprime_401() throws Exception {
            userRepository.deleteAll();

            mockMvc.perform(get("/api/orders").header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Les endpoints d'authentification restent publics")
        void endpointsAuth_publics() throws Exception {
            mockMvc.perform(get("/api/auth/config")).andExpect(status().isOk());
            mockMvc.perform(post("/api/auth/forgot-password")
                            .contentType("application/json")
                            .content("{\"email\":\"inconnu@test.fr\"}"))
                    .andExpect(status().isOk());
        }

        private String secretDeTest() {
            return (String) org.springframework.test.util.ReflectionTestUtils.getField(jwtService, "secretKey");
        }
    }

    @Nested
    @DisplayName("Authentifie mais sans le droit : 403")
    class ClientVersusAdmin {

        @Test
        @DisplayName("Un client sur un endpoint admin recoit 403")
        void tokenClient_surEndpointAdmin_403() throws Exception {
            mockMvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isForbidden())
                    .andExpect(jsonPath("$.status").value(403));
            mockMvc.perform(get("/api/orders/all").header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isForbidden());
            mockMvc.perform(delete("/api/admin/users/1").header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isForbidden());
            mockMvc.perform(post("/api/admin/promote")
                            .header("Authorization", "Bearer " + tokenClient)
                            .contentType("application/json")
                            .content("{\"email\":\"client@test.fr\"}"))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Un client ne peut pas creer de produit, un admin le peut")
        void creationProduit_reserveeAuxAdmins() throws Exception {
            String produit = "{\"name\":\"Brioche\",\"description\":\"test\",\"price\":4.50,\"stock\":10}";

            mockMvc.perform(post("/api/products")
                            .header("Authorization", "Bearer " + tokenClient)
                            .contentType("application/json").content(produit))
                    .andExpect(status().isForbidden());

            mockMvc.perform(post("/api/products")
                            .header("Authorization", "Bearer " + tokenAdmin)
                            .contentType("application/json").content(produit))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("Brioche"));
        }

        @Test
        @DisplayName("Un client ne peut pas creer ni supprimer un point relais")
        void gestionPointsRelais_reserveeAuxAdmins() throws Exception {
            mockMvc.perform(post("/api/pickup-locations")
                            .header("Authorization", "Bearer " + tokenClient)
                            .contentType("application/json")
                            .content("{\"name\":\"Pirate\",\"address\":\"x\",\"city\":\"y\",\"postalCode\":\"00000\"}"))
                    .andExpect(status().isForbidden());
            mockMvc.perform(delete("/api/pickup-locations/1")
                            .header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isForbidden());
        }

        @Test
        @DisplayName("Un admin accede bien aux endpoints admin")
        void tokenAdmin_surEndpointAdmin_200() throws Exception {
            mockMvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + tokenAdmin))
                    .andExpect(status().isOk());
            mockMvc.perform(get("/api/orders/all").header("Authorization", "Bearer " + tokenAdmin))
                    .andExpect(status().isOk());
        }

        @Test
        @DisplayName("Un client accede bien a ses propres ressources")
        void tokenClient_surSesRessources_200() throws Exception {
            mockMvc.perform(get("/api/orders").header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isOk());
            mockMvc.perform(get("/api/cart").header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isOk());
            mockMvc.perform(get("/api/profile").header("Authorization", "Bearer " + tokenClient))
                    .andExpect(status().isOk());
        }
    }
}
