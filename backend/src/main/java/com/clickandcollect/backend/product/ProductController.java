package com.clickandcollect.backend.product;

import com.clickandcollect.backend.product.dto.ProductRequestDTO;
import com.clickandcollect.backend.product.dto.ProductResponseDTO;
import com.clickandcollect.backend.product.Product;
import com.clickandcollect.backend.product.ProductService;
import com.clickandcollect.backend.common.PageResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor

public class ProductController {
    private final ProductService productService;

    @GetMapping
    public PageResponseDTO<ProductResponseDTO> getAllProduct(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 12, sort = "id") Pageable pageable){
        return productService.getProducts(search, pageable);
    }

    @GetMapping("/{id}")
    public ProductResponseDTO getProductById(@PathVariable Long id){
        return productService.getProductById(id);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ProductResponseDTO createProduct(@Valid @RequestBody ProductRequestDTO request){
        return productService.createProduct(request);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ProductResponseDTO updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequestDTO request){
        return productService.updateProduct(id, request);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
    }

}
