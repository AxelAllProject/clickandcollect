package com.clickandcollect.backend.service;

import com.clickandcollect.backend.dto.PickupLocationResponseDTO;
import com.clickandcollect.backend.model.PickupLocation;
import com.clickandcollect.backend.repository.PickupLocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PickupLocationService {

    private final PickupLocationRepository pickupLocationRepository;

    public List<PickupLocationResponseDTO> getAllLocations() {
        return pickupLocationRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .toList();
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
