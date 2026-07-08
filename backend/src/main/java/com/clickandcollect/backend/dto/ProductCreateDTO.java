package com.clickandcollect.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ProductCreateDTO {

    @NotBlank(message = "Le nom du produit est obligatoire")
    private String name;

    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être supérieur à zéro ")
    private BigDecimal price;

    @NotNull(message = "Une valeur en stock est obligatoire")
    @PositiveOrZero(message = "Le stock doit être supérieur ou égale à zéro")
    private Integer stock;
    private String imageUrl;
}
