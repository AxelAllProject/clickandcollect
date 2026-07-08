package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.dto.LoginRequestDTO;
import com.clickandcollect.backend.dto.RegisterRequestDTO;
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

    @PostMapping("/register")
    public UserResponseDTO register(@Valid @RequestBody RegisterRequestDTO request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public UserResponseDTO login(@Valid @RequestBody LoginRequestDTO request) {
        return authService.login(request);
    }
}
