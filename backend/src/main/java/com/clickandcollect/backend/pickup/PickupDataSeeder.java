package com.clickandcollect.backend.pickup;

import com.clickandcollect.backend.pickup.model.PickupLocation;
import com.clickandcollect.backend.pickup.model.PickupSlot;
import com.clickandcollect.backend.pickup.repository.PickupLocationRepository;
import com.clickandcollect.backend.pickup.repository.PickupSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Jeu de données de démo : simule quelques points relais en Hauts-de-France
 * et leurs créneaux de retrait pour les prochains jours.
 * Désactivé quand le profil "prod" est actif (spring.profiles.active=prod).
 */
@Component
@Profile("!prod")
@RequiredArgsConstructor
public class PickupDataSeeder implements CommandLineRunner {

    private final PickupLocationRepository pickupLocationRepository;
    private final PickupSlotRepository pickupSlotRepository;

    private static final List<LocalTime[]> TIME_SLOTS = List.of(
            new LocalTime[]{LocalTime.of(11, 30), LocalTime.of(12, 0)},
            new LocalTime[]{LocalTime.of(12, 0), LocalTime.of(12, 30)},
            new LocalTime[]{LocalTime.of(18, 30), LocalTime.of(19, 0)},
            new LocalTime[]{LocalTime.of(19, 0), LocalTime.of(19, 30)}
    );

    @Override
    public void run(String... args) {
        if (pickupLocationRepository.count() > 0) {
            return;
        }

        List<PickupLocation> locations = List.of(
                new PickupLocation(null, "Point Relais Lille Centre", "12 Rue Nationale", "Lille", "59000"),
                new PickupLocation(null, "Point Relais Amiens Saint-Leu", "5 Rue Saint-Leu", "Amiens", "80000"),
                new PickupLocation(null, "Point Relais Arras Gambetta", "8 Place Gambetta", "Arras", "62000"),
                new PickupLocation(null, "Point Relais Douai Gare", "3 Place de la Gare", "Douai", "59500"),
                new PickupLocation(null, "Point Relais Valenciennes Watteau", "20 Rue Watteau", "Valenciennes", "59300"),
                new PickupLocation(null, "Point Relais Dunkerque Malo", "15 Digue de Mer", "Dunkerque", "59240")
        );
        List<PickupLocation> savedLocations = pickupLocationRepository.saveAll(locations);

        for (PickupLocation location : savedLocations) {
            for (int dayOffset = 1; dayOffset <= 6; dayOffset++) {
                LocalDate date = LocalDate.now().plusDays(dayOffset);
                for (LocalTime[] slotTimes : TIME_SLOTS) {
                    PickupSlot slot = new PickupSlot();
                    slot.setLocation(location);
                    slot.setDate(date);
                    slot.setStartTime(slotTimes[0]);
                    slot.setEndTime(slotTimes[1]);
                    slot.setCapacity(5);
                    pickupSlotRepository.save(slot);
                }
            }
        }
    }
}
