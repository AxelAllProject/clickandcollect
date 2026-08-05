package com.clickandcollect.backend.pickup.service;

import com.clickandcollect.backend.pickup.dto.PickupLocationRequestDTO;
import com.clickandcollect.backend.pickup.dto.PickupLocationResponseDTO;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.pickup.model.PickupLocation;
import com.clickandcollect.backend.pickup.repository.PickupLocationRepository;
import com.clickandcollect.backend.pickup.repository.PickupSlotRepository;
import com.clickandcollect.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PickupLocationService {

    private final PickupLocationRepository pickupLocationRepository;
    private final PickupSlotRepository pickupSlotRepository;
    private final UserRepository userRepository;

    public List<PickupLocationResponseDTO> getAllLocations() {
        return pickupLocationRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public PickupLocationResponseDTO createLocation(PickupLocationRequestDTO request) {
        PickupLocation location = new PickupLocation();
        location.setName(request.getName());
        location.setAddress(request.getAddress());
        location.setCity(request.getCity());
        location.setPostalCode(request.getPostalCode());

        PickupLocation saved = pickupLocationRepository.save(location);
        return mapToDTO(saved);
    }

    public PickupLocationResponseDTO updateLocation(Long id, PickupLocationRequestDTO request) {
        PickupLocation location = pickupLocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Point relais introuvable"));

        location.setName(request.getName());
        location.setAddress(request.getAddress());
        location.setCity(request.getCity());
        location.setPostalCode(request.getPostalCode());

        PickupLocation saved = pickupLocationRepository.save(location);
        return mapToDTO(saved);
    }

    public void deleteLocation(Long id) {
        if (!pickupLocationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Point relais introuvable");
        }
        if (pickupSlotRepository.existsByLocationId(id)) {
            throw new IllegalStateException("Impossible de supprimer ce point relais : des créneaux de retrait y sont encore rattachés. Supprime-les d'abord.");
        }

        List<com.clickandcollect.backend.user.User> usersWithFavorite = userRepository.findByFavoriteLocationId(id);
        usersWithFavorite.forEach(user -> user.setFavoriteLocation(null));
        userRepository.saveAll(usersWithFavorite);

        pickupLocationRepository.deleteById(id);
    }

    private PickupLocationResponseDTO mapToDTO(PickupLocation location) {
        return new PickupLocationResponseDTO(
                location.getId(),
                location.getName(),
                location.getAddress(),
                location.getCity(),
                location.getPostalCode()
        );
    }
}
