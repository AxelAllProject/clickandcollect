package com.clickandcollect.backend.service;

import com.clickandcollect.backend.dto.ProductRequestDTO;
import com.clickandcollect.backend.dto.ProductResponseDTO;
import com.clickandcollect.backend.model.Product;
import com.clickandcollect.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
                .orElseThrow(() -> new RuntimeException("Le produit n'existe pas"));
        return mapToResponseDTO(product);
    }

    public List<ProductResponseDTO> getAllProducts(){
        List<Product> products = productRepository.findAll();

        List<ProductResponseDTO> responseList = new ArrayList<>();

        for (Product product : products) {
            ProductResponseDTO dto = mapToResponseDTO(product);
            responseList.add(dto);
        }
        return responseList;
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
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
