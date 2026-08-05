package com.clickandcollect.backend.pickup.repository;

import com.clickandcollect.backend.pickup.model.PickupLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickupLocationRepository extends JpaRepository<PickupLocation, Long> {
}
