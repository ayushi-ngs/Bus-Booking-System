package com.bus.service;

import com.bus.model.BusRoute;
import com.bus.repository.BusRouteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BusRouteService {

    private final BusRouteRepository routeRepository;

    public BusRouteService(BusRouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    // used by RouteController GET /api/routes/search
    public List<BusRoute> searchBusRoutes(String source, String destination, LocalDate date) {
        return routeRepository.findBySourceIgnoreCaseAndDestinationIgnoreCaseAndDateOfJourney(source, destination, date);
    }

    // used by RouteController POST /api/routes
    public boolean addRoutes(String source, String destination,
                             LocalTime arrivalTime, LocalTime departureTime,
                             LocalDate dateOfJourney, int totalSeats, double price) {

        if (source == null || source.trim().isEmpty()
                || destination == null || destination.trim().isEmpty()
                || dateOfJourney == null
                || departureTime == null
                || totalSeats <= 0
                || price <= 0) {
            return false;
        }

        BusRoute route = new BusRoute();
        route.setSource(source);
        route.setDestination(destination);
        route.setArrivalTime(arrivalTime);
        route.setDepartureTime(departureTime);
        route.setDateOfJourney(dateOfJourney);
        route.setTotalSeats(totalSeats);
        route.setAvailableSeats(totalSeats);
        route.setPrice(price);

        routeRepository.save(route);
        return true;
    }
}
