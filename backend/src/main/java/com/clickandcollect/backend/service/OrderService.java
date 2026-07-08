package com.clickandcollect.backend.service;

import com.clickandcollect.backend.dto.OrderItemRequestDTO;
import com.clickandcollect.backend.dto.OrderItemResponseDTO;
import com.clickandcollect.backend.dto.OrderRequestDTO;
import com.clickandcollect.backend.dto.OrderResponseDTO;
import com.clickandcollect.backend.model.Order;
import com.clickandcollect.backend.model.OrderItem;
import com.clickandcollect.backend.model.Product;
import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.repository.OrderItemRepository;
import com.clickandcollect.backend.repository.OrderRepository;
import com.clickandcollect.backend.repository.ProductRepository;
import com.clickandcollect.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor

public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;

    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO request){
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        List<OrderItemResponseDTO> responseItems = new ArrayList<>();

        for (OrderItemRequestDTO itemDto : request.getItems()){
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

            if (product.getStock() < itemDto.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour le produit : " + product.getName());
            }

            product.setStock(product.getStock() - itemDto.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(product.getPrice());

            OrderItem savedItem = orderItemRepository.save(orderItem);

            OrderItemResponseDTO itemResponse = new OrderItemResponseDTO(
                    savedItem.getId(),
                    product.getId(),
                    savedItem.getQuantity(),
                    savedItem.getPrice()
            );
            responseItems.add(itemResponse);

        }

        OrderResponseDTO finalResponse = new OrderResponseDTO(
                savedOrder.getId(),
                user.getId(),
                savedOrder.getStatus(),
                savedOrder.getCreatedAt(),
                responseItems
        );
        return finalResponse;
    }

}
