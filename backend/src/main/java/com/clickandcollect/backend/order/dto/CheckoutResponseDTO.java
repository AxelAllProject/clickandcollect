package com.clickandcollect.backend.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponseDTO {
    private OrderResponseDTO order;
    private String clientSecret;
    private String publishableKey;
}
