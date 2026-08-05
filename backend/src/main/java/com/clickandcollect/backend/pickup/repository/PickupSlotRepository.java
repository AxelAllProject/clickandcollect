package com.clickandcollect.backend.pickup.repository;

import com.clickandcollect.backend.pickup.model.PickupSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PickupSlotRepository extends JpaRepository<PickupSlot, Long> {

    List<PickupSlot> findByLocationIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(Long locationId, LocalDate fromDate);

    List<PickupSlot> findByDateGreaterThanEqualOrderByDateAscStartTimeAsc(LocalDate fromDate);

    boolean existsByLocationId(Long locationId);
}
