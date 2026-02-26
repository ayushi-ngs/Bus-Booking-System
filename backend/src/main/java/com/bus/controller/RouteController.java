package com.bus.controller;

import com.bus.dto.AddRouteRequest;
import com.bus.model.BusRoute;
import com.bus.security.SessionAuth;
import com.bus.service.BusRouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final BusRouteService routeService;

    public RouteController(BusRouteService routeService) {
        this.routeService = routeService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<BusRoute>> search(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date
    ) {
        LocalDate d = LocalDate.parse(date);
        return ResponseEntity.ok(routeService.searchBusRoutes(source, destination, d));
    }

    @PostMapping
    public ResponseEntity<?> addRoute(@RequestBody AddRouteRequest req, HttpSession session) {
        SessionAuth.requireAdmin(session);

        boolean ok = routeService.addRoutes(
                req.getSource(),
                req.getDestination(),
                LocalTime.parse(req.getArrivalTime()),
                LocalTime.parse(req.getDepartureTime()),
                LocalDate.parse(req.getDateOfJourney()),
                req.getTotalSeats(),
                req.getPrice()
        );

        return ResponseEntity.ok(ok ? "Route added" : "Route add failed");
    }
}