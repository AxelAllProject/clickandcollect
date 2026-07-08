package com.clickandcollect.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class OrderRequestDTO {

    @NotNull
    private Long userId;

    @NotEmpty
    @Valid
    private List<OrderItemRequestDTO> items;
}
