package com.clickandcollect.backend.notification;

import com.clickandcollect.backend.auth.service.EmailService;
import com.clickandcollect.backend.order.event.OrderPaidEvent;
import com.clickandcollect.backend.order.model.Order;
import com.clickandcollect.backend.order.model.OrderItem;
import com.clickandcollect.backend.order.repository.OrderItemRepository;
import com.clickandcollect.backend.order.repository.OrderRepository;
import com.clickandcollect.backend.pickup.model.PickupLocation;
import com.clickandcollect.backend.pickup.model.PickupSlot;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionalEventListener;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderNotificationListener {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final EmailService emailService;

    @TransactionalEventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true )
    public void onOrderPaid(OrderPaidEvent event) {
        Order order = orderRepository.findById(event.orderId()).orElse(null);

        if (order == null) {
            log.warn("Commande {} introuvable : aucune notification envoyée",
                    event.orderId());
            return;
        }

        List<OrderItem> items = orderItemRepository.findByOrderId(order.getId());
        BigDecimal total = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        PickupSlot slot = order.getPickupSlot();
        PickupLocation location = slot.getLocation();

        emailService.sendOrderConfirmationEmail(
                order.getUser().getEmail(),
                order.getId(),
                total,
                location.getName(),
                location.getAddress(),
                location.getCity(),
                slot.getDate(),
                slot.getStartTime(),
                slot.getEndTime()
        );
        log.info("[EMAIL] Confirmation envoyée à {} pour la commande #{}",
                order.getUser().getEmail(), order.getId());
    }
}
