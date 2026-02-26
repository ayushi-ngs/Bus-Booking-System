package com.bus.controller;

import com.bus.dto.BookingReceiptResponse;
import com.bus.dto.BookingRequest;
import com.bus.dto.BookingResponse;
import com.bus.exceptions.BookingNotFound;
import com.bus.exceptions.RouteNotFound;
import com.bus.exceptions.SeatNotAvailable;
import com.bus.model.BookPassenger;
import com.bus.service.BookingService;
import com.bus.service.BusRouteService;
import com.bus.security.SessionAuth;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/passengers")
public class PassengerController {

    private final BusRouteService routeService;
    private final BookingService bookingService;

    public PassengerController(BusRouteService routeService, BookingService bookingService) {
        this.routeService = routeService;
        this.bookingService = bookingService;
    }

    private int requirePassengerId(HttpSession session) {
        return SessionAuth.requirePassengerId(session);
    }

    // Search routes (public)
    @GetMapping("/routes/search")
    public ResponseEntity<?> searchRoutes(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam String date
    ) throws RouteNotFound {
        return ResponseEntity.ok(routeService.searchBusRoutes(source, destination, LocalDate.parse(date)));
    }

    // Book route (requires login)
    @PostMapping("/routes/{routeId}/book")
    public ResponseEntity<BookingReceiptResponse> book(
            @PathVariable int routeId,
            @RequestBody BookingRequest req,
            HttpSession session
    ) throws SQLException, RouteNotFound, SeatNotAvailable {

        int passengerId = requirePassengerId(session);

        List<BookPassenger> seatPassengers = new ArrayList<>();
        if (req.getPassengers() != null) {
            req.getPassengers().forEach(p ->
                    seatPassengers.add(new BookPassenger(p.getName(),
                            p.getAge() == null ? 0 : p.getAge(),
                            p.getGender()))
            );
        }

        BookingReceiptResponse receipt = bookingService.book(passengerId, routeId, seatPassengers);
        return ResponseEntity.ok(receipt);
    }

    // My bookings (requires login)
    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> myBookings(
            @RequestParam(required = false) String bookingId,
            HttpSession session
    ) throws SQLException {
        int passengerId = requirePassengerId(session);
        return ResponseEntity.ok(bookingService.getBookings(bookingId, null, passengerId));
    }

    // Cancel booking (requires login)
    @PostMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<?> cancel(
            @PathVariable String bookingId,
            HttpSession session
    ) throws SQLException, BookingNotFound {
        int passengerId = requirePassengerId(session);
        boolean ok = bookingService.cancelBooking(passengerId, bookingId);
        return ResponseEntity.ok(ok ? "Booking cancelled" : "Booking already cancelled");
    }
}