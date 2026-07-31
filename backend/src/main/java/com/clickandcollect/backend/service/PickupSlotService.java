package com.clickandcollect.backend.service;

import com.clickandcollect.backend.dto.PickupSlotRequestDTO;
import com.clickandcollect.backend.dto.PickupSlotResponseDTO;
import com.clickandcollect.backend.exception.ResourceNotFoundException;
import com.clickandcollect.backend.model.PickupLocation;
import com.clickandcollect.backend.model.PickupSlot;
import com.clickandcollect.backend.repository.OrderRepository;
import com.clickandcollect.backend.repository.PickupLocationRepository;
import com.clickandcollect.backend.repository.PickupSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PickupSlotService {

    private final PickupSlotRepository pickupSlotRepository;
    private final PickupLocationRepository pickupLocationRepository;
    private final OrderRepository orderRepository;

    public List<PickupSlotResponseDTO> getAvailableSlots(Long locationId) {
        List<PickupSlot> slots = (locationId != null)
                ? pickupSlotRepository.findByLocationIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(locationId, LocalDate.now())
                : pickupSlotRepository.findByDateGreaterThanEqualOrderByDateAscStartTimeAsc(LocalDate.now());

        return slots.stream()
                .map(this::mapToDTO)
                .filter(dto -> dto.getRemaining() > 0)
                .toList();
    }

    public PickupSlotResponseDTO createSlot(PickupSlotRequestDTO request) {
        PickupLocation location = pickupLocationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Point relais introuvable"));

        PickupSlot slot = new PickupSlot();
        slot.setLocation(location);
        slot.setDate(request.getDate());
        slot.setStartTime(request.getStartTime());
        slot.setEndTime(request.getEndTime());
        slot.setCapacity(request.getCapacity());

        PickupSlot saved = pickupSlotRepository.save(slot);
        return mapToDTO(saved);
    }

    public void deleteSlot(Long id) {
        if (!pickupSlotRepository.existsById(id)) {
            throw new ResourceNotFoundException("Créneau introuvable");
        }
        pickupSlotRepository.deleteById(id);
    }

    private PickupSlotResponseDTO mapToDTO(PickupSlot slot) {
        long booked = orderRepository.countByPickupSlotIdAndPaymentStatusNot(slot.getId(), "FAILED");
        int remaining = (int) Math.max(0, slot.getCapacity() - booked);

        return new PickupSlotResponseDTO(
                slot.getId(),
                slot.getLocation().getId(),
                slot.getLocation().getName(),
                slot.getLocation().getCity(),
                slot.getDate(),
                slot.getStartTime(),
                slot.getEndTime(),
                slot.getCapacity(),
                remaining
        );
    }
}
