package com.clickandcollect.backend.profile;

import com.clickandcollect.backend.profile.dto.ProfileResponseDTO;
import com.clickandcollect.backend.profile.dto.UpdatePasswordRequestDTO;
import com.clickandcollect.backend.profile.dto.UpdateProfileRequestDTO;
import com.clickandcollect.backend.profile.dto.UpdateSettingsRequestDTO;
import com.clickandcollect.backend.profile.dto.UpdateTwoFactorRequestDTO;
import com.clickandcollect.backend.user.User;
import com.clickandcollect.backend.profile.ProfileService;
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

    @PutMapping("/2fa")
    public ProfileResponseDTO updateTwoFactor(@Valid @RequestBody UpdateTwoFactorRequestDTO request, @AuthenticationPrincipal User currentUser) {
        return profileService.updateTwoFactor(currentUser, request);
    }
}
