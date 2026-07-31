package com.clickandcollect.backend.controller;

import com.clickandcollect.backend.dto.PickupLocationResponseDTO;
import com.clickandcollect.backend.service.PickupLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
