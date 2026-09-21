package com.clickandcollect.backend.cart;

import com.clickandcollect.backend.cart.dto.AddToCartRequestDTO;
import com.clickandcollect.backend.cart.dto.CartItemRequestDTO;
import com.clickandcollect.backend.cart.dto.CartResponseDTO;
import com.clickandcollect.backend.cart.model.Cart;
import com.clickandcollect.backend.cart.model.CartItem;
import com.clickandcollect.backend.cart.repository.CartItemRepository;
import com.clickandcollect.backend.cart.repository.CartRepository;
import com.clickandcollect.backend.common.exception.ForbiddenOperationException;
import com.clickandcollect.backend.common.exception.InsufficientStockException;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.product.Product;
import com.clickandcollect.backend.product.ProductRepository;
import com.clickandcollect.backend.user.Role;
import com.clickandcollect.backend.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Tests unitaires du panier : ajout, fusion des quantites, controle de stock
 * et verification que chacun ne touche que son propre panier.
 */
@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock private CartRepository cartRepository;
    @Mock private CartItemRepository cartItemRepository;
    @Mock private ProductRepository productRepository;

    @InjectMocks private CartService cartService;

    private User camille;
    private User mallory;
    private Cart panierDeCamille;
    private Product croissant;

    private static User utilisateur(Long id, String email) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setRole(Role.USER);
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

    @BeforeEach
    void setUp() {
        camille = utilisateur(1L, "camille@test.fr");
        mallory = utilisateur(2L, "mallory@test.fr");

        panierDeCamille = new Cart();
        panierDeCamille.setId(10L);
        panierDeCamille.setUser(camille);

        croissant = produit(100L, "Croissant", "1.50", 40);
    }

    @Test
    @DisplayName("Le panier est cree a la volee au premier acces")
    void getCart_creeLePanierSiAbsent() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> {
            Cart c = i.getArgument(0);
            c.setId(10L);
            return c;
        });
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of());

        CartResponseDTO reponse = cartService.getCart(camille);

        assertThat(reponse.getItems()).isEmpty();
        assertThat(reponse.getTotal()).isEqualByComparingTo("0");
        verify(cartRepository).save(any(Cart.class));
    }

    @Test
    @DisplayName("Ajouter un produit absent cree une nouvelle ligne")
    void addItem_creeUneLigne() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panierDeCamille));
        when(productRepository.findById(100L)).thenReturn(Optional.of(croissant));
        when(cartItemRepository.findByCartIdAndProductId(10L, 100L)).thenReturn(Optional.empty());
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(ligne(1L, panierDeCamille, croissant, 2)));

        cartService.addItemToCart(camille, new AddToCartRequestDTO(100L, 2));

        ArgumentCaptor<CartItem> capture = ArgumentCaptor.forClass(CartItem.class);
        verify(cartItemRepository).save(capture.capture());
        assertThat(capture.getValue().getQuantity()).isEqualTo(2);
        assertThat(capture.getValue().getProduct()).isEqualTo(croissant);
    }

    @Test
    @DisplayName("Ajouter un produit deja present cumule les quantites au lieu de dupliquer")
    void addItem_cumuleLesQuantites() {
        CartItem existante = ligne(1L, panierDeCamille, croissant, 3);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panierDeCamille));
        when(productRepository.findById(100L)).thenReturn(Optional.of(croissant));
        when(cartItemRepository.findByCartIdAndProductId(10L, 100L)).thenReturn(Optional.of(existante));
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(existante));

        cartService.addItemToCart(camille, new AddToCartRequestDTO(100L, 2));

        assertThat(existante.getQuantity()).isEqualTo(5);
        verify(cartItemRepository).save(existante);
    }

    @Test
    @DisplayName("Le cumul ne peut pas depasser le stock disponible")
    void addItem_refuseSiLeCumulDepasseLeStock() {
        croissant.setStock(4);
        CartItem existante = ligne(1L, panierDeCamille, croissant, 3);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panierDeCamille));
        when(productRepository.findById(100L)).thenReturn(Optional.of(croissant));
        when(cartItemRepository.findByCartIdAndProductId(10L, 100L)).thenReturn(Optional.of(existante));

        // 3 deja dans le panier + 2 demandes = 5 > stock de 4
        assertThatThrownBy(() -> cartService.addItemToCart(camille, new AddToCartRequestDTO(100L, 2)))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessageContaining("Croissant");

        verify(cartItemRepository, never()).save(any());
        assertThat(existante.getQuantity()).isEqualTo(3);
    }

    @Test
    @DisplayName("Ajouter un produit inexistant renvoie 404")
    void addItem_produitInconnu() {
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panierDeCamille));
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addItemToCart(camille, new AddToCartRequestDTO(999L, 1)))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    @DisplayName("Le total du panier est la somme prix x quantite")
    void mapToCartResponse_calculeLeTotal() {
        Product tarte = produit(101L, "Tarte", "14.90", 5);
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panierDeCamille));
        when(cartItemRepository.findByCartId(10L)).thenReturn(List.of(
                ligne(1L, panierDeCamille, croissant, 3),   // 3 x 1.50 = 4.50
                ligne(2L, panierDeCamille, tarte, 2)        // 2 x 14.90 = 29.80
        ));

        CartResponseDTO reponse = cartService.getCart(camille);

        assertThat(reponse.getItems()).hasSize(2);
        assertThat(reponse.getTotal()).isEqualByComparingTo("34.30");
    }

    @Test
    @DisplayName("On ne peut pas modifier la ligne de panier d'un autre utilisateur")
    void updateItem_refuseUnPanierQuiNestPasLeSien() {
        CartItem ligneDeCamille = ligne(1L, panierDeCamille, croissant, 2);
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(ligneDeCamille));

        assertThatThrownBy(() -> cartService.updateItemQuantity(mallory, 1L, new CartItemRequestDTO(99)))
                .isInstanceOf(ForbiddenOperationException.class);

        verify(cartItemRepository, never()).save(any());
        assertThat(ligneDeCamille.getQuantity()).isEqualTo(2);
    }

    @Test
    @DisplayName("On ne peut pas supprimer la ligne de panier d'un autre utilisateur")
    void removeItem_refuseUnPanierQuiNestPasLeSien() {
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(ligne(1L, panierDeCamille, croissant, 2)));

        assertThatThrownBy(() -> cartService.removeItem(mallory, 1L))
                .isInstanceOf(ForbiddenOperationException.class);

        verify(cartItemRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Modifier la quantite au-dela du stock est refuse")
    void updateItem_refuseAuDelaDuStock() {
        croissant.setStock(5);
        when(cartItemRepository.findById(1L)).thenReturn(Optional.of(ligne(1L, panierDeCamille, croissant, 2)));

        assertThatThrownBy(() -> cartService.updateItemQuantity(camille, 1L, new CartItemRequestDTO(6)))
                .isInstanceOf(InsufficientStockException.class);

        verify(cartItemRepository, never()).save(any());
    }

    @Test
    @DisplayName("Vider le panier supprime toutes ses lignes")
    void clearCart_supprimeTout() {
        List<CartItem> lignes = List.of(ligne(1L, panierDeCamille, croissant, 2));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(panierDeCamille));
        when(cartItemRepository.findByCartId(10L)).thenReturn(lignes);

        cartService.clearCart(camille);

        verify(cartItemRepository).deleteAll(lignes);
    }

    @Test
    @DisplayName("Une ligne de panier inexistante renvoie 404")
    void updateItem_ligneInconnue() {
        when(cartItemRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.updateItemQuantity(camille, 404L, new CartItemRequestDTO(1)))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
