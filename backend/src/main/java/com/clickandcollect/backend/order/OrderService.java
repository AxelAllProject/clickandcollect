package com.clickandcollect.backend.order;

import com.clickandcollect.backend.order.dto.CheckoutRequestDTO;
import com.clickandcollect.backend.order.dto.CheckoutResponseDTO;
import com.clickandcollect.backend.order.dto.OrderItemResponseDTO;
import com.clickandcollect.backend.order.dto.OrderResponseDTO;
import com.clickandcollect.backend.pickup.dto.PickupSlotResponseDTO;
import com.clickandcollect.backend.common.exception.ForbiddenOperationException;
import com.clickandcollect.backend.common.exception.InsufficientStockException;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.order.SlotFullException;
import com.clickandcollect.backend.cart.model.Cart;
import com.clickandcollect.backend.cart.model.CartItem;
import com.clickandcollect.backend.order.model.Order;
import com.clickandcollect.backend.order.model.OrderItem;
import com.clickandcollect.backend.pickup.model.PickupSlot;
import com.clickandcollect.backend.product.Product;
import com.clickandcollect.backend.user.Role;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.cart.repository.CartItemRepository;
import com.clickandcollect.backend.cart.repository.CartRepository;
import com.clickandcollect.backend.order.repository.OrderItemRepository;
import com.clickandcollect.backend.order.repository.OrderRepository;
import com.clickandcollect.backend.pickup.repository.PickupSlotRepository;
import com.clickandcollect.backend.product.ProductRepository;
import com.clickandcollect.backend.payment.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.clickandcollect.backend.order.event.OrderPaidEvent;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
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
    private final PickupSlotRepository pickupSlotRepository;
    private final StripeService stripeService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public CheckoutResponseDTO checkout(User currentUser, CheckoutRequestDTO request) {

        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Panier introuvable"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Le panier est vide");
        }

        PickupSlot slot = pickupSlotRepository.findById(request.getPickupSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Créneau introuvable"));

        long booked = orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(slot.getId(), "FAILED", "CANCELLED");
        if (booked >= slot.getCapacity()) {
            throw new SlotFullException("Ce créneau est complet, choisis-en un autre.");
        }

        Order order = new Order();
        order.setUser(currentUser);
        order.setStatus("PENDING");
        order.setPaymentStatus("AWAITING_PAYMENT");
        order.setPickupSlot(slot);
        order.setCreatedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);

        List<OrderItemResponseDTO> responseItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

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
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));

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

        PaymentIntent paymentIntent;
        try {
            paymentIntent = stripeService.createPaymentIntent(total, savedOrder.getId());
        } catch (StripeException e) {
            throw new IllegalStateException("Impossible de créer le paiement : " + e.getMessage());
        }

        savedOrder.setStripePaymentIntentId(paymentIntent.getId());
        orderRepository.save(savedOrder);

        OrderResponseDTO orderDTO = new OrderResponseDTO(
                savedOrder.getId(),
                currentUser.getId(),
                currentUser.getEmail(),
                savedOrder.getStatus(),
                savedOrder.getPaymentStatus(),
                savedOrder.getCreatedAt(),
                responseItems,
                mapSlotToDTO(slot)
        );

        return new CheckoutResponseDTO(orderDTO, paymentIntent.getClientSecret(), stripeService.getPublishableKey());
    }

    @Transactional
    public void markOrderPaid(String paymentIntentId) {
        orderRepository.findByStripePaymentIntentId(paymentIntentId)
                .ifPresent(order -> {
                    order.setPaymentStatus("PAID");
                    orderRepository.save(order);
                    eventPublisher.publishEvent(new OrderPaidEvent(order.getId()));
                });
    }

    @Transactional
    public void markOrderFailed(String paymentIntentId) {
        orderRepository.findByStripePaymentIntentId(paymentIntentId)
                .ifPresent(order -> {
                    order.setPaymentStatus("FAILED");
                    orderRepository.save(order);

                    List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
                    for (OrderItem item : items) {
                        Product product = item.getProduct();
                        product.setStock(product.getStock() + item.getQuantity());
                        productRepository.save(product);
                    }
                });
    }

    @Transactional
    public OrderResponseDTO cancelOrder(Long orderId, User currentUser) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande non trouvée"));

        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new ForbiddenOperationException("Vous ne pouvez pas annuler cette commande");
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalStateException("Cette commande ne peut plus être annulée");
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        for (OrderItem item : items) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus("CANCELLED");
        Order savedOrder = orderRepository.save(order);

        return mapToOrderResponseDTO(savedOrder);
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
                order.getPaymentStatus(),
                order.getCreatedAt(),
                itemDTOs,
                mapSlotToDTO(order.getPickupSlot())
        );
    }

    private PickupSlotResponseDTO mapSlotToDTO(PickupSlot slot) {
        long booked = orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(slot.getId(), "FAILED", "CANCELLED");
        int remaining = (int) Math.max(0, slot.getCapacity() - booked);

        return new PickupSlotResponseDTO(
                slot.getId(),
                slot.getLocation().getId(),
                slot.getLocation().getName(),
                slot.getLocation().getCity(),
                slot.getDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getCapacity(),
                remaining
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
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

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
