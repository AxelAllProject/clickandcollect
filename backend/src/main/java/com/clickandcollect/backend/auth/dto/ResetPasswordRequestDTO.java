package com.clickandcollect.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequestDTO {

    @NotBlank
    private String token;

    @Size(min = 12, message = "Le mot de passe doit contenir au moins 12 caractères")
    @NotBlank
    private String newPassword;
}
