package com.clickandcollect.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private String role;
    private Long favoriteLocationId;
}
