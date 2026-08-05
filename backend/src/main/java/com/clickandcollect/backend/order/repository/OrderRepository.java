package com.clickandcollect.backend.order.repository;

import com.clickandcollect.backend.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    long countByPickupSlotIdAndPaymentStatusNotAndStatusNot(Long pickupSlotId, String paymentStatus, String status);

    java.util.Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId);
}
