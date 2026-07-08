package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.dto.OrderRequestDTO;
import com.clickandcollect.backend.dto.OrderResponseDTO;
import com.clickandcollect.backend.model.Order;
import com.clickandcollect.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor

public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public OrderResponseDTO createOrder(@Valid @RequestBody OrderRequestDTO request){
        return orderService.createOrder(request);
    }
}
