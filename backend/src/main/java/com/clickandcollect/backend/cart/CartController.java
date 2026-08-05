package com.clickandcollect.backend.cart;

import com.clickandcollect.backend.cart.dto.AddToCartRequestDTO;
import com.clickandcollect.backend.cart.dto.CartItemRequestDTO;
import com.clickandcollect.backend.cart.dto.CartResponseDTO;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.cart.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor

public class CartController {
    private final CartService cartService;

    @GetMapping
    public CartResponseDTO getCart(@AuthenticationPrincipal User currentUser) {
        return cartService.getCart(currentUser);
    }

    @PostMapping("/items")
    public CartResponseDTO addItemToCart(@Valid @RequestBody AddToCartRequestDTO request, @AuthenticationPrincipal User currentUser) {
        return cartService.addItemToCart(currentUser, request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponseDTO updateItemQuantity(@PathVariable Long itemId, @Valid @RequestBody CartItemRequestDTO request, @AuthenticationPrincipal User currentUser) {
        return cartService.updateItemQuantity(currentUser, itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponseDTO removeItem(@PathVariable Long itemId, @AuthenticationPrincipal User currentUser) {
        return cartService.removeItem(currentUser, itemId);
    }

    @DeleteMapping
    public void clearCart(@AuthenticationPrincipal User currentUser) {
        cartService.clearCart(currentUser);
    }
}
