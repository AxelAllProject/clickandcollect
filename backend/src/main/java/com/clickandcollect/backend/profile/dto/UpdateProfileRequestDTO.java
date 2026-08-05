package com.clickandcollect.backend.profile.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequestDTO {

    @NotBlank
    private String firstname;

    @NotBlank
    private String lastname;

    private String phone;
}
