package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.dto.ProfileResponseDTO;
import com.clickandcollect.backend.dto.UpdatePasswordRequestDTO;
import com.clickandcollect.backend.dto.UpdateProfileRequestDTO;
import com.clickandcollect.backend.dto.UpdateSettingsRequestDTO;
import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ProfileResponseDTO getProfile(@AuthenticationPrincipal User currentUser) {
        return profileService.getProfile(currentUser);
    }

    @PutMapping
    public ProfileResponseDTO updateProfile(@Valid @RequestBody UpdateProfileRequestDTO request, @AuthenticationPrincipal User currentUser) {
        return profileService.updateProfile(currentUser, request);
    }

    @PutMapping("/password")
    public void updatePassword(@Valid @RequestBody UpdatePasswordRequestDTO request, @AuthenticationPrincipal User currentUser) {
        profileService.updatePassword(currentUser, request);
    }

    @PutMapping("/settings")
    public ProfileResponseDTO updateSettings(@Valid @RequestBody UpdateSettingsRequestDTO request, @AuthenticationPrincipal User currentUser) {
        return profileService.updateSettings(currentUser, request);
    }
}
