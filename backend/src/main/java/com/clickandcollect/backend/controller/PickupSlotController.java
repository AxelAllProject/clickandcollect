package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.dto.PickupSlotRequestDTO;
import com.clickandcollect.backend.dto.PickupSlotResponseDTO;
import com.clickandcollect.backend.service.PickupSlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pickup-slots")
@RequiredArgsConstructor
public class PickupSlotController {

    private final PickupSlotService pickupSlotService;

    @GetMapping
    public List<PickupSlotResponseDTO> getAvailableSlots(@RequestParam(required = false) Long locationId) {
        return pickupSlotService.getAvailableSlots(locationId);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public PickupSlotResponseDTO createSlot(@Valid @RequestBody PickupSlotRequestDTO request) {
        return pickupSlotService.createSlot(request);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteSlot(@PathVariable Long id) {
        pickupSlotService.deleteSlot(id);
    }
}
