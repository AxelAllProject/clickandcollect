package com.clickandcollect.backend.product;

import com.clickandcollect.backend.product.dto.ProductRequestDTO;
import com.clickandcollect.backend.product.dto.ProductResponseDTO;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.product.Product;
import com.clickandcollect.backend.product.ProductRepository;
import com.clickandcollect.backend.common.PageResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class ProductService {
    private final ProductRepository productRepository;

    public ProductResponseDTO createProduct(ProductRequestDTO request){
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setStock(request.getStock());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());

        Product savedProduct = productRepository.save(product);

        return mapToResponseDTO(savedProduct);
    }

    public ProductResponseDTO getProductById(Long id){
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Le produit n'existe pas"));
        return mapToResponseDTO(product);
    }

    public PageResponseDTO<ProductResponseDTO> getProducts(String search, Pageable pageable){
        Page<Product> products = (search == null || search.isBlank())
                ? productRepository.findAll(pageable)
                : productRepository.findByNameContainingIgnoreCase(search.trim(), pageable);

        return PageResponseDTO.from(products, this::mapToResponseDTO);
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setStock(request.getStock());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());

        Product updatedProduct = productRepository.save(product);

        return mapToResponseDTO(updatedProduct);
    }

    public void deleteProduct(Long id){
        productRepository.deleteById(id);
    }

    private ProductResponseDTO mapToResponseDTO(Product product){
        return new ProductResponseDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl()
        );
    }
}
