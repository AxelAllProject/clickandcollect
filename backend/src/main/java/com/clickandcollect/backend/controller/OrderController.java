package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.dto.OrderRequestDTO;
import com.clickandcollect.backend.dto.OrderResponseDTO;
import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.service.OrderService;
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

    @PostMapping
    public OrderResponseDTO createOrder(@Valid @RequestBody OrderRequestDTO request, @AuthenticationPrincipal User currentUser){
        return orderService.createOrder(request, currentUser);
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

}
