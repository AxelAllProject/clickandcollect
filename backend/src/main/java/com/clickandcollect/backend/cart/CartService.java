package com.clickandcollect.backend.cart;

import com.clickandcollect.backend.cart.dto.AddToCartRequestDTO;
import com.clickandcollect.backend.cart.dto.CartItemRequestDTO;
import com.clickandcollect.backend.cart.dto.CartItemResponseDTO;
import com.clickandcollect.backend.cart.dto.CartResponseDTO;
import com.clickandcollect.backend.common.exception.ForbiddenOperationException;
import com.clickandcollect.backend.common.exception.InsufficientStockException;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.cart.model.Cart;
import com.clickandcollect.backend.cart.model.CartItem;
import com.clickandcollect.backend.product.Product;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.cart.repository.CartItemRepository;
import com.clickandcollect.backend.cart.repository.CartRepository;
import com.clickandcollect.backend.product.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public CartResponseDTO getCart(User currentUser) {
        Cart cart = getOrCreateCart(currentUser);
        return mapToCartResponseDTO(cart);
    }

    @Transactional
    public CartResponseDTO addItemToCart(User currentUser, AddToCartRequestDTO request) {
        Cart cart = getOrCreateCart(currentUser);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        int newQuantity = (cartItem != null ? cartItem.getQuantity() : 0) + request.getQuantity();

        if (product.getStock() < newQuantity) {
            throw new InsufficientStockException("Stock insuffisant pour le produit : " + product.getName());
        }

        if (cartItem == null) {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
        } else {
            cartItem.setQuantity(newQuantity);
        }
        cartItemRepository.save(cartItem);

        return mapToCartResponseDTO(cart);
    }

    @Transactional
    public CartResponseDTO updateItemQuantity(User currentUser, Long itemId, CartItemRequestDTO request) {
        CartItem cartItem = getOwnedCartItem(currentUser, itemId);

        if (cartItem.getProduct().getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Stock insuffisant pour le produit : " + cartItem.getProduct().getName());
        }

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return mapToCartResponseDTO(cartItem.getCart());
    }

    @Transactional
    public CartResponseDTO removeItem(User currentUser, Long itemId) {
        CartItem cartItem = getOwnedCartItem(currentUser, itemId);
        Cart cart = cartItem.getCart();

        cartItemRepository.delete(cartItem);

        return mapToCartResponseDTO(cart);
    }

    @Transactional
    public void clearCart(User currentUser) {
        Cart cart = getOrCreateCart(currentUser);
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        cartItemRepository.deleteAll(items);
    }

    private Cart getOrCreateCart(User currentUser) {
        return cartRepository.findByUserId(currentUser.getId())
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(currentUser);
                    newCart.setCreatedAt(LocalDateTime.now());
                    return cartRepository.save(newCart);
                });
    }

    private CartItem getOwnedCartItem(User currentUser, Long itemId) {
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Ligne de panier non trouvée"));

        boolean isOwner = cartItem.getCart().getUser().getId().equals(currentUser.getId());
        if (!isOwner) {
            throw new ForbiddenOperationException("Vous ne pouvez pas modifier ce panier");
        }
        return cartItem;
    }

    private CartResponseDTO mapToCartResponseDTO(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemResponseDTO> itemDTOs = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem item : items) {
            Product product = item.getProduct();
            BigDecimal price = product.getPrice();
            itemDTOs.add(new CartItemResponseDTO(
                    item.getId(),
                    product.getId(),
                    product.getName(),
                    product.getImageUrl(),
                    item.getQuantity(),
                    price
            ));
            total = total.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        return new CartResponseDTO(
                cart.getId(),
                cart.getUser().getId(),
                itemDTOs,
                total
        );
    }
}
