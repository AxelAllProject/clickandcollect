package com.clickandcollect.backend.cart.dto;

import com.clickandcollect.backend.user.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class CartResponseDTO {
    private Long id;
    private Long userId;
    private List<CartItemResponseDTO> items;
    private BigDecimal total;

}
