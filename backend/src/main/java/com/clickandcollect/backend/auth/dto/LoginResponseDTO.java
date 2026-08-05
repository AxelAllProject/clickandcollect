package com.clickandcollect.backend.auth.dto;

import com.clickandcollect.backend.user.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private boolean twoFactorRequired;

    private UserResponseDTO user;
}
