package com.clickandcollect.backend.repository;

import com.clickandcollect.backend.model.PickupLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickupLocationRepository extends JpaRepository<PickupLocation, Long> {
}
