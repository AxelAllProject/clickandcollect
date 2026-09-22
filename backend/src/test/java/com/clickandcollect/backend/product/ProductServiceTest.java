package com.clickandcollect.backend.product;

import com.clickandcollect.backend.common.PageResponseDTO;
import com.clickandcollect.backend.product.dto.ProductResponseDTO;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Pagination et recherche du catalogue")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product produit(Long id, String nom) {
        Product product = new Product();
        product.setId(id);
        product.setName(nom);
        product.setDescription("Description");
        product.setPrice(new BigDecimal("2.50"));
        product.setStock(10);
        return product;
    }

    @Test
    @DisplayName("Sans recherche, la page demandee est renvoyee avec ses metadonnees")
    void getProducts_sansRecherche() {
        Pageable pageable = PageRequest.of(1, 2);
        when(productRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(produit(3L, "Pain"), produit(4L, "Brioche")), pageable, 6));

        PageResponseDTO<ProductResponseDTO> page = productService.getProducts(null, pageable);

        assertThat(page.content()).hasSize(2);
        assertThat(page.page()).isEqualTo(1);
        assertThat(page.size()).isEqualTo(2);
        assertThat(page.totalElements()).isEqualTo(6);
        assertThat(page.totalPages()).isEqualTo(3);
        assertThat(page.first()).isFalse();
        assertThat(page.last()).isFalse();
        verify(productRepository, never()).findByNameContainingIgnoreCase(any(), any());
    }

    @Test
    @DisplayName("Avec une recherche, le filtrage est delegue a la base")
    void getProducts_avecRecherche() {
        Pageable pageable = PageRequest.of(0, 12);
        when(productRepository.findByNameContainingIgnoreCase(eq("pain"), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of(produit(3L, "Pain")), pageable, 1));

        PageResponseDTO<ProductResponseDTO> page = productService.getProducts("  pain  ", pageable);

        assertThat(page.content()).hasSize(1);
        assertThat(page.content().get(0).getName()).isEqualTo("Pain");
        assertThat(page.last()).isTrue();
        verify(productRepository, never()).findAll(any(Pageable.class));
    }

    @Test
    @DisplayName("Une recherche vide est traitee comme une absence de recherche")
    void getProducts_rechercheVide() {
        Pageable pageable = PageRequest.of(0, 12);
        when(productRepository.findAll(pageable))
                .thenReturn(new PageImpl<>(List.of(), pageable, 0));

        PageResponseDTO<ProductResponseDTO> page = productService.getProducts("   ", pageable);

        assertThat(page.content()).isEmpty();
        assertThat(page.totalElements()).isZero();
    }
}
