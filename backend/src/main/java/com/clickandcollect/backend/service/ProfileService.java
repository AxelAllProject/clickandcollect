package com.clickandcollect.backend.service;

import com.clickandcollect.backend.dto.ProfileResponseDTO;
import com.clickandcollect.backend.dto.UpdatePasswordRequestDTO;
import com.clickandcollect.backend.dto.UpdateProfileRequestDTO;
import com.clickandcollect.backend.dto.UpdateSettingsRequestDTO;
import com.clickandcollect.backend.exception.InvalidCredentialsException;
import com.clickandcollect.backend.exception.ResourceNotFoundException;
import com.clickandcollect.backend.model.PickupLocation;
import com.clickandcollect.backend.model.User;
import com.clickandcollect.backend.repository.PickupLocationRepository;
import com.clickandcollect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final PickupLocationRepository pickupLocationRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileResponseDTO getProfile(User currentUser) {
        return mapToDTO(currentUser);
    }

    public ProfileResponseDTO updateProfile(User currentUser, UpdateProfileRequestDTO request) {
        currentUser.setFirstname(request.getFirstname());
        currentUser.setLastname(request.getLastname());
        currentUser.setPhone(request.getPhone());
        User saved = userRepository.save(currentUser);
        return mapToDTO(saved);
    }

    public void updatePassword(User currentUser, UpdatePasswordRequestDTO request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new InvalidCredentialsException("Mot de passe actuel incorrect");
        }
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    public ProfileResponseDTO updateSettings(User currentUser, UpdateSettingsRequestDTO request) {
        if (request.getFavoriteLocationId() == null) {
            currentUser.setFavoriteLocation(null);
        } else {
            PickupLocation location = pickupLocationRepository.findById(request.getFavoriteLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Point relais introuvable"));
            currentUser.setFavoriteLocation(location);
        }
        User saved = userRepository.save(currentUser);
        return mapToDTO(saved);
    }

    private ProfileResponseDTO mapToDTO(User user) {
        return new ProfileResponseDTO(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getFavoriteLocation() != null ? user.getFavoriteLocation().getId() : null
        );
    }
}
