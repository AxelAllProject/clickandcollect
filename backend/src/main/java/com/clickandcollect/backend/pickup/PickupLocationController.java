package com.clickandcollect.backend.pickup;

import com.clickandcollect.backend.pickup.dto.PickupLocationRequestDTO;
import com.clickandcollect.backend.pickup.dto.PickupLocationResponseDTO;
import com.clickandcollect.backend.pickup.service.PickupLocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickup-locations")
@RequiredArgsConstructor
public class PickupLocationController {

    private final PickupLocationService pickupLocationService;

    @GetMapping
    public List<PickupLocationResponseDTO> getAllLocations() {
        return pickupLocationService.getAllLocations();
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public PickupLocationResponseDTO createLocation(@Valid @RequestBody PickupLocationRequestDTO request) {
        return pickupLocationService.createLocation(request);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public PickupLocationResponseDTO updateLocation(@PathVariable Long id, @Valid @RequestBody PickupLocationRequestDTO request) {
        return pickupLocationService.updateLocation(id, request);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteLocation(@PathVariable Long id) {
        pickupLocationService.deleteLocation(id);
    }
}
