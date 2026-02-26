package com.bus.repository;

import com.bus.model.BusRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface BusRouteRepository extends JpaRepository<BusRoute, Integer> {

    List<BusRoute> findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDateOfJourney(
            String source, String destination, LocalDate dateOfJourney
    );

    @Modifying
    @Query("update BusRoute r set r.availableSeats = r.availableSeats - :seats " +
            "where r.routeId = :routeId and r.availableSeats >= :seats")
    int decrementSeats(int routeId, int seats);

    @Modifying
    @Query("update BusRoute r set r.availableSeats = r.availableSeats + :seats " +
            "where r.routeId = :routeId")
    int incrementSeats(int routeId, int seats);
}
