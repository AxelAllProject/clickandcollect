package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.dto.AuthConfigResponseDTO;
import com.clickandcollect.backend.dto.ForgotPasswordRequestDTO;
import com.clickandcollect.backend.dto.GoogleLoginRequestDTO;
import com.clickandcollect.backend.dto.LoginRequestDTO;
import com.clickandcollect.backend.dto.LoginResponseDTO;
import com.clickandcollect.backend.dto.MessageResponseDTO;
import com.clickandcollect.backend.dto.RegisterRequestDTO;
import com.clickandcollect.backend.dto.ResetPasswordRequestDTO;
import com.clickandcollect.backend.dto.TwoFactorResendRequestDTO;
import com.clickandcollect.backend.dto.TwoFactorVerifyRequestDTO;
import com.clickandcollect.backend.dto.UserResponseDTO;
import com.clickandcollect.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {
    private final AuthService authService;
    private final com.clickandcollect.backend.service.GoogleAuthService googleAuthService;

    @GetMapping("/config")
    public AuthConfigResponseDTO getConfig() {
        return new AuthConfigResponseDTO(googleAuthService.getClientId());
    }

    @PostMapping("/register")
    public UserResponseDTO register(@Valid @RequestBody RegisterRequestDTO request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }

    @PostMapping("/2fa/verify")
    public UserResponseDTO verifyTwoFactorCode(@Valid @RequestBody TwoFactorVerifyRequestDTO request) {
        return authService.verifyTwoFactorCode(request);
    }

    @PostMapping("/2fa/resend")
    public MessageResponseDTO resendTwoFactorCode(@Valid @RequestBody TwoFactorResendRequestDTO request) {
        authService.resendTwoFactorCode(request);
        return new MessageResponseDTO("Un nouveau code a été envoyé par email.");
    }

    @PostMapping("/forgot-password")
    public MessageResponseDTO forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request) {
        authService.forgotPassword(request);
        return new MessageResponseDTO("Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.");
    }

    @PostMapping("/reset-password")
    public MessageResponseDTO resetPassword(@Valid @RequestBody ResetPasswordRequestDTO request) {
        authService.resetPassword(request);
        return new MessageResponseDTO("Mot de passe réinitialisé avec succès.");
    }

    @PostMapping("/google")
    public UserResponseDTO loginWithGoogle(@Valid @RequestBody GoogleLoginRequestDTO request) {
        return authService.loginWithGoogle(request);
    }
}
