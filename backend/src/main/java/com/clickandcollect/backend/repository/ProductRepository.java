package com.clickandcollect.backend.repository;

import com.clickandcollect.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
