package com.clickandcollect.backend.order;

import com.clickandcollect.backend.order.dto.CheckoutRequestDTO;
import com.clickandcollect.backend.order.dto.CheckoutResponseDTO;
import com.clickandcollect.backend.order.dto.OrderResponseDTO;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.order.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor

public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    public CheckoutResponseDTO checkout(@Valid @RequestBody CheckoutRequestDTO request, @AuthenticationPrincipal User currentUser){
        return orderService.checkout(currentUser, request);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}/status")
    public OrderResponseDTO updateOrderStatus(@PathVariable Long id,@RequestParam String status ) {
        return orderService.updateOrderStatus(id, status);
    }

    @GetMapping
    public List<OrderResponseDTO> getMyOrders(@AuthenticationPrincipal User currentUser){
        return orderService.getOrdersForUser(currentUser);
    }

    @GetMapping("/{id}")
    public OrderResponseDTO getOrderById(@PathVariable Long id, @AuthenticationPrincipal User currentUser){
        return orderService.getOrderById(id, currentUser);
    }

    @PutMapping("/{id}/cancel")
    public OrderResponseDTO cancelOrder(@PathVariable Long id, @AuthenticationPrincipal User currentUser){
        return orderService.cancelOrder(id, currentUser);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/all")
    public List<OrderResponseDTO> getAllOrders(){
        return orderService.getAllOrders();
    }

}
