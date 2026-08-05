package com.clickandcollect.backend.pickup.service;

import com.clickandcollect.backend.pickup.dto.PickupSlotRequestDTO;
import com.clickandcollect.backend.pickup.dto.PickupSlotResponseDTO;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.pickup.model.PickupLocation;
import com.clickandcollect.backend.pickup.model.PickupSlot;
import com.clickandcollect.backend.order.repository.OrderRepository;
import com.clickandcollect.backend.pickup.repository.PickupLocationRepository;
import com.clickandcollect.backend.pickup.repository.PickupSlotRepository;
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
        long booked = orderRepository.countByPickupSlotIdAndPaymentStatusNotAndStatusNot(slot.getId(), "FAILED", "CANCELLED");
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
