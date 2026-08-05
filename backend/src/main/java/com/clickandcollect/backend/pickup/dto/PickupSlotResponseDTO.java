package com.clickandcollect.backend.pickup.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PickupSlotResponseDTO {
    private Long id;
    private Long locationId;
    private String locationName;
    private String locationCity;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private int capacity;
    private int remaining;
}
