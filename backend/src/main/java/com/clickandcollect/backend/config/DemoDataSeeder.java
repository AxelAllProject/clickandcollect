package com.clickandcollect.backend.config;

import com.clickandcollect.backend.model.Product;
import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.repository.ProductRepository;
import com.clickandcollect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Jeu de données de démo pour tester en local : un compte admin et un
 * catalogue de départ. Ne fait rien si un compte/produit existe déjà.
 */
@Component
@Order(1)
@RequiredArgsConstructor
public class DemoDataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@clickandcollect.fr").isEmpty()) {
            User admin = new User();
            admin.setFirstname("Admin");
            admin.setLastname("ClickAndCollect");
            admin.setEmail("admin@clickandcollect.fr");
            admin.setPassword(passwordEncoder.encode("AdminTest1234!"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        if (userRepository.findByEmail("client.test@clickandcollect.fr").isEmpty()) {
            User client = new User();
            client.setFirstname("Camille");
            client.setLastname("Client");
            client.setEmail("client.test@clickandcollect.fr");
            client.setPassword(passwordEncoder.encode("ClientTest1234!"));
            client.setRole("USER");
            userRepository.save(client);
        }

        if (productRepository.count() == 0) {
            List<Product> products = List.of(
                    new Product(null, "Croissant pur beurre", "Croissant artisanal au beurre AOP, feuilletage maison.", new BigDecimal("1.50"), 40, null),
                    new Product(null, "Pain de campagne", "Pain au levain naturel, cuit au feu de bois.", new BigDecimal("3.20"), 25, null),
                    new Product(null, "Tarte aux pommes", "Tarte fine aux pommes de saison et compotée maison.", new BigDecimal("14.90"), 8, null),
                    new Product(null, "Quiche lorraine", "Quiche maison, lardons et crème fraîche fermière.", new BigDecimal("6.50"), 12, null),
                    new Product(null, "Salade fraîcheur", "Salade de saison, légumes locaux, vinaigrette maison.", new BigDecimal("7.90"), 15, null),
                    new Product(null, "Éclair au chocolat", "Éclair pâtissier garni de crème pâtissière au chocolat.", new BigDecimal("3.80"), 20, null)
            );
            productRepository.saveAll(products);
        }
    }
}
