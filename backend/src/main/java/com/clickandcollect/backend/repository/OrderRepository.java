package com.clickandcollect.backend.repository;

import com.clickandcollect.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    long countByPickupSlotIdAndPaymentStatusNot(Long pickupSlotId, String paymentStatus);

    java.util.Optional<Order> findByStripePaymentIntentId(String stripePaymentIntentId);
}
