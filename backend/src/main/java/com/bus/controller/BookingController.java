package com.bus.controller;
import com.bus.dto.BookingResponse;
import com.bus.dto.StatsResponse;
import com.bus.security.SessionAuth;
import com.bus.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/admin/bookings")
    public ResponseEntity<List<BookingResponse>> adminBookings(
            @RequestParam(required = false) String bookingId,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Integer passengerId,
            HttpSession session
    ) {
        SessionAuth.requireAdmin(session);
        LocalDate localDate = (date == null || date.trim().isEmpty()) ? null : LocalDate.parse(date);
        return ResponseEntity.ok(bookingService.getBookings(bookingId, localDate, passengerId));
    }

    @GetMapping("/admin/statistics")
    public ResponseEntity<StatsResponse> statistics(HttpSession session) {
        SessionAuth.requireAdmin(session);
        return ResponseEntity.ok(bookingService.viewStatistics());
    }
}