package com.clickandcollect.backend.service;

import com.clickandcollect.backend.dto.OrderItemResponseDTO;
import com.clickandcollect.backend.dto.OrderResponseDTO;
import com.clickandcollect.backend.exception.ForbiddenOperationException;
import com.clickandcollect.backend.exception.InsufficientStockException;
import com.clickandcollect.backend.exception.ResourceNotFoundException;
import com.clickandcollect.backend.model.Cart;
import com.clickandcollect.backend.model.CartItem;
import com.clickandcollect.backend.model.Order;
import com.clickandcollect.backend.model.OrderItem;
import com.clickandcollect.backend.model.Product;
import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.repository.CartItemRepository;
import com.clickandcollect.backend.repository.CartRepository;
import com.clickandcollect.backend.repository.OrderItemRepository;
import com.clickandcollect.backend.repository.OrderRepository;
import com.clickandcollect.backend.repository.ProductRepository;
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
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public OrderResponseDTO checkout(User currentUser) {

        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Panier introuvable"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Le panier est vide");
        }

        Order order = new Order();
        order.setUser(currentUser);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        List<OrderItemResponseDTO> responseItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new InsufficientStockException("Stock insuffisant pour le produit : " + product.getName());
            }

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            OrderItem savedItem = orderItemRepository.save(orderItem);

            OrderItemResponseDTO itemResponse = new OrderItemResponseDTO(
                    savedItem.getId(),
                    product.getId(),
                    product.getName(),
                    product.getImageUrl(),
                    savedItem.getQuantity(),
                    savedItem.getPrice()
            );
            responseItems.add(itemResponse);
        }

        cartItemRepository.deleteAll(cartItems);

        return new OrderResponseDTO(
                savedOrder.getId(),
                currentUser.getId(),
                currentUser.getEmail(),
                savedOrder.getStatus(),
                savedOrder.getCreatedAt(),
                responseItems
        );
    }

    public OrderResponseDTO updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("La commande n'a pas été trouvé"));
        order.setStatus(newStatus);

        Order savedOrder = orderRepository.save(order);

        return mapToOrderResponseDTO(savedOrder);

    }

    private OrderResponseDTO mapToOrderResponseDTO(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        List<OrderItemResponseDTO> itemDTOs = new ArrayList<>();

        for (OrderItem item : items) {
            itemDTOs.add(new OrderItemResponseDTO(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getProduct().getImageUrl(),
                    item.getQuantity(),
                    item.getPrice()
            ));
        }

        return new OrderResponseDTO(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getEmail(),
                order.getStatus(),
                order.getCreatedAt(),
                itemDTOs
        );
    }

    public List<OrderResponseDTO> getOrdersForUser(User currentUser) {
        List<Order> orders = orderRepository.findByUserId(currentUser.getId());

        List<OrderResponseDTO> responseDTOList = new ArrayList<>();

        for (Order order : orders) {
            OrderResponseDTO dto = mapToOrderResponseDTO(order);
            responseDTOList.add(dto);
        }
        return responseDTOList;
    }

    public OrderResponseDTO getOrderById(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        boolean isOwner = order.getUser().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            throw new ForbiddenOperationException("Vous ne pouvez pas accéder à la commande");
        }
        return mapToOrderResponseDTO(order);

    }

    public List<OrderResponseDTO> getAllOrders(){

        List<Order> orders = orderRepository.findAll();

        List<OrderResponseDTO> responseList = new ArrayList<>();

        for (Order order : orders) {
            OrderResponseDTO dto = mapToOrderResponseDTO(order);
            responseList.add(dto);
        }
        return responseList;
    }
}
