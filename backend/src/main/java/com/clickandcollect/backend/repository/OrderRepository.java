package com.clickandcollect.backend.repository;

import com.clickandcollect.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
