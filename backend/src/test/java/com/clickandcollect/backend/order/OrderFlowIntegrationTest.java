package com.clickandcollect.backend.order;

import com.clickandcollect.backend.cart.repository.CartItemRepository;
import com.clickandcollect.backend.cart.repository.CartRepository;
import com.clickandcollect.backend.order.model.Order;
import com.clickandcollect.backend.order.repository.OrderRepository;
import com.clickandcollect.backend.payment.StripeService;
import com.clickandcollect.backend.pickup.model.PickupLocation;
import com.clickandcollect.backend.pickup.model.PickupSlot;
import com.clickandcollect.backend.pickup.repository.PickupLocationRepository;
import com.clickandcollect.backend.pickup.repository.PickupSlotRepository;
import com.clickandcollect.backend.product.Product;
import com.clickandcollect.backend.product.ProductRepository;
import com.clickandcollect.backend.user.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.model.PaymentIntent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Test de bout en bout du parcours d'achat, via HTTP : inscription, connexion,
 * panier, checkout et consultation des commandes. Seul Stripe est mocke.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class OrderFlowIntegrationTest {

    @Autowired private MockMvc mockMvc;
    /** Jackson n'expose pas de bean ObjectMapper dans ce contexte : instance locale. */
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Autowired private ProductRepository productRepository;
    @Autowired private PickupLocationRepository pickupLocationRepository;
    @Autowired private PickupSlotRepository pickupSlotRepository;
    @Autowired private OrderRepository orderRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository cartItemRepository;
    @Autowired private UserRepository userRepository;

    @MockitoBean private StripeService stripeService;
    @MockitoBean private JavaMailSender javaMailSender;

    private Product croissant;
    private PickupSlot creneau;
    private String token;

    @BeforeEach
    void setUp() throws Exception {
        orderRepository.deleteAll();
        cartItemRepository.deleteAll();
        cartRepository.deleteAll();
        productRepository.deleteAll();
        pickupSlotRepository.deleteAll();
        pickupLocationRepository.deleteAll();
        userRepository.deleteAll();

        croissant = new Product();
        croissant.setName("Croissant");
        croissant.setDescription("Pur beurre");
        croissant.setPrice(new BigDecimal("1.50"));
        croissant.setStock(40);
        croissant = productRepository.save(croissant);

        PickupLocation lieu = new PickupLocation(null, "Boulangerie Centre", "1 rue du Four", "Lyon", "69001");
        lieu = pickupLocationRepository.save(lieu);

        creneau = new PickupSlot(null, lieu, LocalDate.now().plusDays(1),
                LocalTime.of(10, 0), LocalTime.of(11, 0), 2);
        creneau = pickupSlotRepository.save(creneau);

        PaymentIntent intent = new PaymentIntent();
        intent.setId("pi_test_123");
        intent.setClientSecret("pi_test_123_secret");
        when(stripeService.createPaymentIntent(any(BigDecimal.class), anyLong())).thenReturn(intent);
        when(stripeService.getPublishableKey()).thenReturn("pk_test_fake");

        token = inscrireEtConnecter("camille@test.fr", "MotDePasseSolide1!");
    }

    private String inscrireEtConnecter(String email, String motDePasse) throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("""
                                {"firstname":"Camille","lastname":"Client","email":"%s","password":"%s"}
                                """.formatted(email, motDePasse)))
                .andExpect(status().isOk());

        String corps = mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content("""
                                {"email":"%s","password":"%s"}
                                """.formatted(email, motDePasse)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.twoFactorRequired").value(false))
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(corps).get("user").get("token").asText();
    }

    private JsonNode ajouterAuPanier(long productId, int quantite) throws Exception {
        String corps = mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("""
                                {"productId":%d,"quantity":%d}
                                """.formatted(productId, quantite)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(corps);
    }

    @Test
    @DisplayName("Parcours complet : inscription, panier, checkout, commande consultable")
    void parcoursComplet() throws Exception {
        JsonNode panier = ajouterAuPanier(croissant.getId(), 3);
        assertThat(panier.get("total").decimalValue()).isEqualByComparingTo("4.50");

        String corpsCheckout = mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"pickupSlotId\":%d}".formatted(creneau.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.clientSecret").value("pi_test_123_secret"))
                .andExpect(jsonPath("$.publishableKey").value("pk_test_fake"))
                .andExpect(jsonPath("$.order.status").value("PENDING"))
                .andExpect(jsonPath("$.order.paymentStatus").value("AWAITING_PAYMENT"))
                .andExpect(jsonPath("$.order.items.length()").value(1))
                .andReturn().getResponse().getContentAsString();

        long orderId = objectMapper.readTree(corpsCheckout).get("order").get("id").asLong();

        // Le stock est bien decremente en base
        assertThat(productRepository.findById(croissant.getId()).orElseThrow().getStock()).isEqualTo(37);

        // Le panier est vide apres la commande
        mockMvc.perform(get("/api/cart").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items.length()").value(0))
                .andExpect(jsonPath("$.total").value(0));

        // La commande est persistee et rattachee au bon PaymentIntent
        Order enBase = orderRepository.findById(orderId).orElseThrow();
        assertThat(enBase.getStripePaymentIntentId()).isEqualTo("pi_test_123");

        // Le client retrouve sa commande dans la premiere page de ses commandes
        mockMvc.perform(get("/api/orders").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].id").value(orderId))
                .andExpect(jsonPath("$.content[0].customerEmail").value("camille@test.fr"));
    }

    @Test
    @DisplayName("Checkout avec un panier vide : refuse, aucune commande creee")
    void checkoutPanierVide() throws Exception {
        // Un compte qui n'a jamais ouvert son panier n'a pas encore de ligne en base :
        // le checkout renvoie alors 404 ("Panier introuvable") et non 400. L'issue metier
        // est la meme (commande refusee) mais les deux cas devraient partager un code.
        mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"pickupSlotId\":%d}".formatted(creneau.getId())))
                .andExpect(status().isNotFound());

        // Panier existant mais vide : 400 "Le panier est vide".
        mockMvc.perform(get("/api/cart").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"pickupSlotId\":%d}".formatted(creneau.getId())))
                .andExpect(status().isBadRequest());

        assertThat(orderRepository.findAll()).isEmpty();
    }

    @Test
    @DisplayName("Ajouter plus que le stock disponible renvoie 409 et ne touche pas au stock")
    void ajoutAuDelaDuStock() throws Exception {
        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"productId\":%d,\"quantity\":41}".formatted(croissant.getId())))
                .andExpect(status().isConflict());

        assertThat(productRepository.findById(croissant.getId()).orElseThrow().getStock()).isEqualTo(40);
    }

    @Test
    @DisplayName("Un creneau sature refuse la commande suivante avec un 409")
    void creneauSature() throws Exception {
        // La capacite du creneau est de 2 : on la remplit avec deux commandes.
        for (int i = 0; i < 2; i++) {
            ajouterAuPanier(croissant.getId(), 1);
            mockMvc.perform(post("/api/orders/checkout")
                            .header("Authorization", "Bearer " + token)
                            .contentType("application/json")
                            .content("{\"pickupSlotId\":%d}".formatted(creneau.getId())))
                    .andExpect(status().isOk());
        }

        ajouterAuPanier(croissant.getId(), 1);
        mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"pickupSlotId\":%d}".formatted(creneau.getId())))
                .andExpect(status().isConflict());

        assertThat(orderRepository.findAll()).hasSize(2);
    }

    @Test
    @DisplayName("Un client ne peut pas lire la commande d'un autre client")
    void commandeDUnAutreClient_403() throws Exception {
        ajouterAuPanier(croissant.getId(), 1);
        String corps = mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"pickupSlotId\":%d}".formatted(creneau.getId())))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        long orderId = objectMapper.readTree(corps).get("order").get("id").asLong();

        String tokenMallory = inscrireEtConnecter("mallory@test.fr", "MotDePasseSolide2!");

        mockMvc.perform(get("/api/orders/" + orderId).header("Authorization", "Bearer " + tokenMallory))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Annuler sa commande la passe en CANCELLED et remet le stock en rayon")
    void annulationRemetLeStock() throws Exception {
        ajouterAuPanier(croissant.getId(), 3);
        String corps = mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"pickupSlotId\":%d}".formatted(creneau.getId())))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        long orderId = objectMapper.readTree(corps).get("order").get("id").asLong();

        assertThat(productRepository.findById(croissant.getId()).orElseThrow().getStock()).isEqualTo(37);

        mockMvc.perform(put("/api/orders/" + orderId + "/cancel").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));

        assertThat(productRepository.findById(croissant.getId()).orElseThrow().getStock()).isEqualTo(40);

        // Deuxieme annulation refusee : pas de double recredit
        mockMvc.perform(put("/api/orders/" + orderId + "/cancel").header("Authorization", "Bearer " + token))
                .andExpect(status().isBadRequest());
        assertThat(productRepository.findById(croissant.getId()).orElseThrow().getStock()).isEqualTo(40);
    }

    @Test
    @DisplayName("Les donnees de validation invalides sont rejetees avant tout traitement")
    void validationDesEntrees() throws Exception {
        // Mot de passe trop court (< 12 caracteres)
        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("""
                                {"firstname":"A","lastname":"B","email":"court@test.fr","password":"court"}
                                """))
                .andExpect(status().isBadRequest());

        // Email mal forme
        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("""
                                {"firstname":"A","lastname":"B","email":"pas-un-email","password":"MotDePasseSolide1!"}
                                """))
                .andExpect(status().isBadRequest());

        // Quantite negative
        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"productId\":%d,\"quantity\":-5}".formatted(croissant.getId())))
                .andExpect(status().isBadRequest());

        assertThat(userRepository.findByEmail("court@test.fr")).isEmpty();
        assertThat(userRepository.findByEmail("pas-un-email")).isEmpty();
    }

    @Test
    @DisplayName("Un email deja inscrit renvoie 409")
    void emailDejaInscrit_409() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content("""
                                {"firstname":"Camille","lastname":"Client","email":"camille@test.fr","password":"MotDePasseSolide1!"}
                                """))
                .andExpect(status().isConflict());

        assertThat(userRepository.findAll().stream()
                .filter(u -> u.getEmail().equals("camille@test.fr")).toList()).hasSize(1);
    }

    @Test
    @DisplayName("Les creneaux exposent le nombre de places restantes")
    void creneauxExposentLesPlacesRestantes() throws Exception {
        List<PickupSlot> creneaux = pickupSlotRepository.findAll();
        assertThat(creneaux).hasSize(1);

        mockMvc.perform(get("/api/pickup-slots").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].capacity").value(2))
                .andExpect(jsonPath("$[0].remaining").value(2));

        ajouterAuPanier(croissant.getId(), 1);
        mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", "Bearer " + token)
                        .contentType("application/json")
                        .content("{\"pickupSlotId\":%d}".formatted(creneau.getId())))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/pickup-slots").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].remaining").value(1));
    }
}
