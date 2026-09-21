package com.clickandcollect.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Verifie que le contexte Spring complet demarre (beans, securite, JPA).
 * Sur le profil "test" : base H2 en memoire, aucun service externe requis.
 */
@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

}
