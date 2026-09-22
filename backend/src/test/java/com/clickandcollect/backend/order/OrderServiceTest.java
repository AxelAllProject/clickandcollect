package com.clickandcollect.backend.order;

import com.clickandcollect.backend.cart.model.Cart;
import com.clickandcollect.backend.cart.model.CartItem;
import com.clickandcollect.backend.cart.repository.CartItemRepository;
import com.clickandcollect.backend.cart.repository.CartRepository;
import com.clickandcollect.backend.common.exception.ForbiddenOperationException;
import com.clickandcollect.backend.common.exception.InsufficientStockException;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.order.dto.CheckoutRequestDTO;
import com.clickandcollect.backend.order.dto.CheckoutResponseDTO;
import com.clickandcollect.backend.order.dto.OrderResponseDTO;
import com.clickandcollect.backend.order.event.OrderPaidEvent;
import com.clickandcollect.backend.order.model.Order;
import com.clickandcollect.backend.order.model.OrderItem;
import com.clickandcollect.backend.order.repository.OrderItemRepository;
import com.clickandcollect.backend.order.repository.OrderRepository;
import com.clickandcollect.backend.payment.StripeService;
import com.clickandcollect.backend.pickup.model.PickupLocation;
import com.clickandcollect.backend.pickup.model.PickupSlot;
import com.clickandcollect.backend.pickup.repository.PickupSlotRepository;
import com.clickandcollect.backend.product.Product;
import com.clickandcollect.backend.product.ProductRepository;
import com.clickandcollect.backend.user.Role;
import com.clickandcollect.backend.user.User;
import com.stripe.exception.ApiConnectionException;
import com.stripe.model.PaymentIntent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.clickandcollect.backend.common.PageResponseDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires du parcours de commande : checkout, webhooks de paiement,
 * annulation et controle d'acces.
 */
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private ProductRepository productRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private PickupSlotRepository pickupSlotRepository;
    @Mock private StripeService stripeService;
    @Mock private ApplicationEventPublisher eventPublisher;

    @InjectMocks private OrderService orderService;

    private User camille;
    private User mallory;
    private Cart panier;
    private Product croissant;
    private PickupSlot creneau;

    private static User utilisateur(Long id, String email, Role role) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setRole(role);
        return user;
    }

    private static Product produit(Long id, String nom, String prix, int stock) {
        Product product = new Product();
        product.setId(id);
        product.setName(nom);
        product.setPrice(new BigDecimal(prix));
        product.setStock(stock);
        return product;
    }

    private static CartItem ligne(Long id, Cart cart, Product product, int quantite) {
        CartItem item = new CartItem();
        item.setId(id);
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(quantite);
        return item;
    }

    private static OrderItem ligneCommande(Long id, Order order, Product product, int quantite, String prix) {
        OrderItem item = new OrderItem();
        item.setId(id);
        item.setOrder(order);
        item.setProduct(product);
        item.setQuantity(quantite);
        item.setPrice(new BigDecimal(prix));
        return item;
    }

    @BeforeEach
    void setUp() {
        camille = utilisateur(1L, "camille@test.fr", Role.USER);
        mallory = utilisateur(2L, "mallory@test.fr", Role.USER);

        panier = new Cart();
        panier.setId(10L);
        panier.setUser(camille);

        croissant = produit(100L, "Croissant", "1.50", 40);

        PickupLocation lieu = new PickupLocation(5L, "Boulangerie Centre", "1 rue du Four", "Lyon", "69001");
        creneau = new PickupSlot(50L, lieu, LocalDate.now().plusDays(1),
                LocalTime.of(10, 0), LocalTime.of(11, 0), 5);
    }

    /** Fait renvoyer par save() l'entite passee, avec un id genere. */
    private void simuleLesSauvegardes() {
        AtomicLong idCommande = new AtomicLong(1000L);
        lenient().when(orderRepository.save(any(Order.class))).thenAnswer(i -> {
            Order o = i.getArgument(0);
            if (o.getId() == null) {
                o.setId(idCommande.incrementAndGet());
            }
            return o;
        });
        AtomicLong idLigne = new AtomicLong(2000L);
        lenient().when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(i -> {
            OrderItem item = i.getArgument(0);
            item.setId(idLigne.incrementAndGet());
            return item;
        });
    }

    /** Vrai PaymentIntent Stripe renseigne a la main : pas de mock imbrique dans un when(). */
    private static PaymentIntent paymentIntentFactice(String id, String clientSecret) {
        PaymentIntent intent = new PaymentIntent();
        intent.setId(id);
        intent.setClientSecret(clientSecret);
        return intent;
    }

    @Nested
    @DisplayName("Checkout")
    class Checkout {

        @Test
        @DisplayName("Parcours nominal : commande creee, stock decremente, panier vide, PaymentIntent renvoye")
        void checkout_parcoursNominal() throws Exception {
            CartItem item = ligne(1L, panier, croissant, 3);
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(item));
            when(pickupSlotRepository.findById(50L)).thenReturn(Optional.of(creneau));
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(50L, "FAILED", "CANCELLED"))
                    .thenReturn(0L);
            simuleLesSauvegardes();
            when(stripeService.createPaymentIntent(any(BigDecimal.class), anyLong()))
                    .thenReturn(paymentIntentFactice("pi_123", "pi_123_secret"));
            when(stripeService.getPublishableKey()).thenReturn("pk_test_fake");

            CheckoutResponseDTO reponse = orderService.checkout(camille, new CheckoutRequestDTO(50L));

            // Stock decremente de la quantite commandee
            assertThat(croissant.getStock()).isEqualTo(37);
            // Panier vide apres commande
            verify(cartItemRepository).deleteAll(List.of(item));
            // Etat initial de la commande
            assertThat(reponse.getOrder().getStatus()).isEqualTo("PENDING");
            assertThat(reponse.getOrder().getPaymentStatus()).isEqualTo("AWAITING_PAYMENT");
            assertThat(reponse.getOrder().getItems()).hasSize(1);
            assertThat(reponse.getOrder().getItems().get(0).getQuantity()).isEqualTo(3);
            assertThat(reponse.getClientSecret()).isEqualTo("pi_123_secret");
            assertThat(reponse.getPublishableKey()).isEqualTo("pk_test_fake");
        }

        @Test
        @DisplayName("Le montant envoye a Stripe est bien prix x quantite, toutes lignes confondues")
        void checkout_montantEnvoyeAStripe() throws Exception {
            Product tarte = produit(101L, "Tarte", "14.90", 10);
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(
                    ligne(1L, panier, croissant, 3),  // 4.50
                    ligne(2L, panier, tarte, 2)       // 29.80
            ));
            when(pickupSlotRepository.findById(50L)).thenReturn(Optional.of(creneau));
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);
            simuleLesSauvegardes();
            when(stripeService.createPaymentIntent(any(BigDecimal.class), anyLong()))
                    .thenReturn(paymentIntentFactice("pi_123", "secret"));

            orderService.checkout(camille, new CheckoutRequestDTO(50L));

            ArgumentCaptor<BigDecimal> montant = ArgumentCaptor.forClass(BigDecimal.class);
            verify(stripeService).createPaymentIntent(montant.capture(), anyLong());
            assertThat(montant.getValue()).isEqualByComparingTo("34.30");
        }

        @Test
        @DisplayName("L'id du PaymentIntent est memorise pour pouvoir reconcilier le webhook")
        void checkout_memoriseLIdPaymentIntent() throws Exception {
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(ligne(1L, panier, croissant, 1)));
            when(pickupSlotRepository.findById(50L)).thenReturn(Optional.of(creneau));
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);
            simuleLesSauvegardes();
            when(stripeService.createPaymentIntent(any(BigDecimal.class), anyLong()))
                    .thenReturn(paymentIntentFactice("pi_abc", "secret"));

            orderService.checkout(camille, new CheckoutRequestDTO(50L));

            ArgumentCaptor<Order> capture = ArgumentCaptor.forClass(Order.class);
            verify(orderRepository, org.mockito.Mockito.atLeastOnce()).save(capture.capture());
            assertThat(capture.getValue().getStripePaymentIntentId()).isEqualTo("pi_abc");
        }

        @Test
        @DisplayName("Un panier vide ne cree pas de commande")
        void checkout_panierVide() {
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of());

            assertThatThrownBy(() -> orderService.checkout(camille, new CheckoutRequestDTO(50L)))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("panier est vide");

            verify(orderRepository, never()).save(any());
            verifyNoInteractions(stripeService);
        }

        @Test
        @DisplayName("Un creneau complet est refuse")
        void checkout_creneauComplet() {
            creneau.setCapacity(5);
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(ligne(1L, panier, croissant, 1)));
            when(pickupSlotRepository.findById(50L)).thenReturn(Optional.of(creneau));
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(50L, "FAILED", "CANCELLED"))
                    .thenReturn(5L);

            assertThatThrownBy(() -> orderService.checkout(camille, new CheckoutRequestDTO(50L)))
                    .isInstanceOf(SlotFullException.class);

            verify(orderRepository, never()).save(any());
            assertThat(croissant.getStock()).isEqualTo(40);
        }

        @Test
        @DisplayName("Les commandes annulees ou echouees ne consomment pas la capacite du creneau")
        void checkout_capaciteIgnoreAnnuleesEtEchouees() throws Exception {
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(ligne(1L, panier, croissant, 1)));
            when(pickupSlotRepository.findById(50L)).thenReturn(Optional.of(creneau));
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);
            simuleLesSauvegardes();
            when(stripeService.createPaymentIntent(any(BigDecimal.class), anyLong()))
                    .thenReturn(paymentIntentFactice("pi_1", "secret"));

            orderService.checkout(camille, new CheckoutRequestDTO(50L));

            // Le comptage doit explicitement exclure FAILED et CANCELLED.
            verify(orderRepository, org.mockito.Mockito.atLeastOnce())
                    .countByPickupSlotIdAndPaymentStatusNotAndStatusNot(50L, "FAILED", "CANCELLED");
        }

        @Test
        @DisplayName("Un stock insuffisant bloque la commande")
        void checkout_stockInsuffisant() {
            croissant.setStock(2);
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(ligne(1L, panier, croissant, 3)));
            when(pickupSlotRepository.findById(50L)).thenReturn(Optional.of(creneau));
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);
            simuleLesSauvegardes();

            assertThatThrownBy(() -> orderService.checkout(camille, new CheckoutRequestDTO(50L)))
                    .isInstanceOf(InsufficientStockException.class)
                    .hasMessageContaining("Croissant");

            verifyNoInteractions(stripeService);
            assertThat(croissant.getStock()).isEqualTo(2);
        }

        @Test
        @DisplayName("Un creneau inexistant renvoie 404")
        void checkout_creneauInconnu() {
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(ligne(1L, panier, croissant, 1)));
            when(pickupSlotRepository.findById(999L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.checkout(camille, new CheckoutRequestDTO(999L)))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("Une panne Stripe remonte une erreur et ne laisse pas de commande payable")
        void checkout_erreurStripe() throws Exception {
            when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panier));
            when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(ligne(1L, panier, croissant, 1)));
            when(pickupSlotRepository.findById(50L)).thenReturn(Optional.of(creneau));
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);
            simuleLesSauvegardes();
            when(stripeService.createPaymentIntent(any(BigDecimal.class), anyLong()))
                    .thenThrow(new ApiConnectionException("Stripe injoignable"));

            assertThatThrownBy(() -> orderService.checkout(camille, new CheckoutRequestDTO(50L)))
                    .isInstanceOf(IllegalStateException.class)
                    .hasMessageContaining("Impossible de creer le paiement".replace("creer", "créer"));
        }
    }

    @Nested
    @DisplayName("Webhooks de paiement")
    class Webhooks {

        private Order commande(String statut, String statutPaiement) {
            Order order = new Order();
            order.setId(1000L);
            order.setUser(camille);
            order.setPickupSlot(creneau);
            order.setStatus(statut);
            order.setPaymentStatus(statutPaiement);
            order.setCreatedAt(LocalDateTime.now());
            order.setStripePaymentIntentId("pi_123");
            return order;
        }

        @Test
        @DisplayName("payment_intent.succeeded passe la commande en PAID et declenche l'email")
        void markOrderPaid_marqueEtPublieLEvenement() {
            Order order = commande("PENDING", "AWAITING_PAYMENT");
            when(orderRepository.findByStripePaymentIntentId("pi_123")).thenReturn(Optional.of(order));

            orderService.markOrderPaid("pi_123");

            assertThat(order.getPaymentStatus()).isEqualTo("PAID");
            verify(eventPublisher).publishEvent(new OrderPaidEvent(1000L));
        }

        @Test
        @DisplayName("Un PaymentIntent inconnu est ignore sans erreur")
        void markOrderPaid_paymentIntentInconnu() {
            when(orderRepository.findByStripePaymentIntentId("pi_inconnu")).thenReturn(Optional.empty());

            orderService.markOrderPaid("pi_inconnu");

            verifyNoInteractions(eventPublisher);
            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("payment_intent.payment_failed remet le stock en rayon")
        void markOrderFailed_restaureLeStock() {
            Order order = commande("PENDING", "AWAITING_PAYMENT");
            croissant.setStock(37);
            when(orderRepository.findByStripePaymentIntentId("pi_123")).thenReturn(Optional.of(order));
            when(orderItemRepository.findByOrderId(1000L))
                    .thenReturn(List.of(ligneCommande(1L, order, croissant, 3, "1.50")));

            orderService.markOrderFailed("pi_123");

            assertThat(order.getPaymentStatus()).isEqualTo("FAILED");
            assertThat(croissant.getStock()).isEqualTo(40);
        }

        @Test
        @DisplayName("Un webhook d'echec rejoue par Stripe ne doit pas recrediter le stock deux fois")
        void markOrderFailed_estIdempotent() {
            Order order = commande("PENDING", "AWAITING_PAYMENT");
            croissant.setStock(37);
            when(orderRepository.findByStripePaymentIntentId("pi_123")).thenReturn(Optional.of(order));
            when(orderItemRepository.findByOrderId(1000L))
                    .thenReturn(List.of(ligneCommande(1L, order, croissant, 3, "1.50")));

            orderService.markOrderFailed("pi_123");
            orderService.markOrderFailed("pi_123"); // relivraison Stripe

            assertThat(croissant.getStock())
                    .as("le stock ne doit revenir qu'a 40, pas a 43")
                    .isEqualTo(40);
        }

        @Test
        @DisplayName("Un webhook de succes rejoue par Stripe ne doit pas renvoyer un second email")
        void markOrderPaid_estIdempotent() {
            Order order = commande("PENDING", "AWAITING_PAYMENT");
            when(orderRepository.findByStripePaymentIntentId("pi_123")).thenReturn(Optional.of(order));

            orderService.markOrderPaid("pi_123");
            orderService.markOrderPaid("pi_123"); // relivraison Stripe

            verify(eventPublisher, org.mockito.Mockito.times(1)).publishEvent(any(OrderPaidEvent.class));
        }
    }

    @Nested
    @DisplayName("Annulation")
    class Annulation {

        private Order commandeDeCamille(String statut) {
            Order order = new Order();
            order.setId(1000L);
            order.setUser(camille);
            order.setPickupSlot(creneau);
            order.setStatus(statut);
            order.setPaymentStatus("PAID");
            order.setCreatedAt(LocalDateTime.now());
            return order;
        }

        @Test
        @DisplayName("Annuler une commande PENDING remet le stock et passe en CANCELLED")
        void cancelOrder_ok() {
            Order order = commandeDeCamille("PENDING");
            croissant.setStock(37);
            when(orderRepository.findById(1000L)).thenReturn(Optional.of(order));
            when(orderItemRepository.findByOrderId(1000L))
                    .thenReturn(List.of(ligneCommande(1L, order, croissant, 3, "1.50")));
            when(orderRepository.save(any(Order.class))).thenAnswer(i -> i.getArgument(0));
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);

            OrderResponseDTO reponse = orderService.cancelOrder(1000L, camille);

            assertThat(reponse.getStatus()).isEqualTo("CANCELLED");
            assertThat(croissant.getStock()).isEqualTo(40);
        }

        @Test
        @DisplayName("On ne peut pas annuler la commande de quelqu'un d'autre")
        void cancelOrder_refuseUnAutreClient() {
            Order order = commandeDeCamille("PENDING");
            when(orderRepository.findById(1000L)).thenReturn(Optional.of(order));

            assertThatThrownBy(() -> orderService.cancelOrder(1000L, mallory))
                    .isInstanceOf(ForbiddenOperationException.class);

            assertThat(order.getStatus()).isEqualTo("PENDING");
            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("Une commande deja annulee ne peut pas etre annulee a nouveau (pas de double recredit)")
        void cancelOrder_refuseUneCommandeDejaAnnulee() {
            Order order = commandeDeCamille("CANCELLED");
            when(orderRepository.findById(1000L)).thenReturn(Optional.of(order));

            assertThatThrownBy(() -> orderService.cancelOrder(1000L, camille))
                    .isInstanceOf(IllegalStateException.class);

            assertThat(croissant.getStock()).isEqualTo(40);
            verify(orderRepository, never()).save(any());
        }

        @Test
        @DisplayName("Une commande deja preparee ne peut plus etre annulee")
        void cancelOrder_refuseUneCommandePreparee() {
            Order order = commandeDeCamille("READY");
            when(orderRepository.findById(1000L)).thenReturn(Optional.of(order));

            assertThatThrownBy(() -> orderService.cancelOrder(1000L, camille))
                    .isInstanceOf(IllegalStateException.class);
        }

        @Test
        @DisplayName("Annuler une commande inexistante renvoie 404")
        void cancelOrder_commandeInconnue() {
            when(orderRepository.findById(anyLong())).thenReturn(Optional.empty());

            assertThatThrownBy(() -> orderService.cancelOrder(404L, camille))
                    .isInstanceOf(ResourceNotFoundException.class);
        }
    }

    @Nested
    @DisplayName("Controle d'acces a une commande")
    class ControleDAcces {

        private Order commandeDeCamille() {
            Order order = new Order();
            order.setId(1000L);
            order.setUser(camille);
            order.setPickupSlot(creneau);
            order.setStatus("PENDING");
            order.setPaymentStatus("PAID");
            order.setCreatedAt(LocalDateTime.now());
            return order;
        }

        @Test
        @DisplayName("Le proprietaire accede a sa commande")
        void getOrderById_proprietaire() {
            when(orderRepository.findById(1000L)).thenReturn(Optional.of(commandeDeCamille()));
            when(orderItemRepository.findByOrderId(1000L)).thenReturn(List.of());
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);

            assertThat(orderService.getOrderById(1000L, camille).getId()).isEqualTo(1000L);
        }

        @Test
        @DisplayName("Un autre client ne peut pas lire la commande (IDOR)")
        void getOrderById_refuseUnAutreClient() {
            when(orderRepository.findById(1000L)).thenReturn(Optional.of(commandeDeCamille()));

            assertThatThrownBy(() -> orderService.getOrderById(1000L, mallory))
                    .isInstanceOf(ForbiddenOperationException.class);
        }

        @Test
        @DisplayName("Un admin peut lire la commande de n'importe quel client")
        void getOrderById_adminAutorise() {
            User admin = utilisateur(9L, "admin@test.fr", Role.ADMIN);
            when(orderRepository.findById(1000L)).thenReturn(Optional.of(commandeDeCamille()));
            when(orderItemRepository.findByOrderId(1000L)).thenReturn(List.of());
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);

            assertThat(orderService.getOrderById(1000L, admin).getId()).isEqualTo(1000L);
        }

        @Test
        @DisplayName("Le client ne recoit que ses propres commandes")
        void getOrdersForUser_filtreParUtilisateur() {
            Pageable pageable = PageRequest.of(0, 10);
            when(orderRepository.findByUserId(eq(1L), any(Pageable.class)))
                    .thenReturn(new PageImpl<>(List.of(commandeDeCamille()), pageable, 1));
            when(orderItemRepository.findByOrderId(1000L)).thenReturn(List.of());
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(anyLong(), anyString(), anyString()))
                    .thenReturn(0L);

            PageResponseDTO<OrderResponseDTO> commandes = orderService.getOrdersForUser(camille, pageable);

            assertThat(commandes.content()).hasSize(1);
            assertThat(commandes.content().get(0).getUserId()).isEqualTo(1L);
            assertThat(commandes.totalElements()).isEqualTo(1);
            verify(orderRepository).findByUserId(eq(1L), any(Pageable.class));
        }
    }

    @Nested
    @DisplayName("Places restantes d'un creneau")
    class PlacesRestantes {

        @Test
        @DisplayName("Le nombre de places restantes tient compte des reservations")
        void placesRestantes_calculees() {
            Order order = new Order();
            order.setId(1000L);
            order.setUser(camille);
            order.setPickupSlot(creneau);
            order.setStatus("PENDING");
            order.setPaymentStatus("PAID");
            order.setCreatedAt(LocalDateTime.now());

            when(orderRepository.findById(1000L)).thenReturn(Optional.of(order));
            when(orderItemRepository.findByOrderId(1000L)).thenReturn(List.of());
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(eq(50L), anyString(), anyString()))
                    .thenReturn(2L);

            OrderResponseDTO reponse = orderService.getOrderById(1000L, camille);

            assertThat(reponse.getPickupSlot().getCapacity()).isEqualTo(5);
            assertThat(reponse.getPickupSlot().getRemaining()).isEqualTo(3);
        }

        @Test
        @DisplayName("Le nombre de places restantes ne devient jamais negatif")
        void placesRestantes_jamaisNegatif() {
            Order order = new Order();
            order.setId(1000L);
            order.setUser(camille);
            order.setPickupSlot(creneau);
            order.setStatus("PENDING");
            order.setPaymentStatus("PAID");
            order.setCreatedAt(LocalDateTime.now());

            when(orderRepository.findById(1000L)).thenReturn(Optional.of(order));
            when(orderItemRepository.findByOrderId(1000L)).thenReturn(List.of());
            when(orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(eq(50L), anyString(), anyString()))
                    .thenReturn(8L); // surbooking constate

            assertThat(orderService.getOrderById(1000L, camille)
                    .getPickupSlot().getRemaining()).isZero();
        }
    }
}
