package com.clickandcollect.backend.product;

import com.clickandcollect.backend.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
