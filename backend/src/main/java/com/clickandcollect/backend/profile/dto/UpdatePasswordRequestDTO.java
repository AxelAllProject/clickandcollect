package com.clickandcollect.backend.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePasswordRequestDTO {

    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 12, message = "Le mot de passe doit contenir au moins 12 caractères.")
    private String newPassword;
}
