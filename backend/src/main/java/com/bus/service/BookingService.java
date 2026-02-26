package com.bus.service;

import com.bus.dto.BookingReceiptResponse;
import com.bus.dto.BookingResponse;
import com.bus.dto.StatsResponse;
import com.bus.exceptions.BookingNotFound;
import com.bus.exceptions.RouteNotFound;
import com.bus.exceptions.SeatNotAvailable;
import com.bus.model.*;
import com.bus.repository.BookingRepository;
import com.bus.repository.BusRouteRepository;
import com.bus.repository.PassengerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final BusRouteRepository routeRepository;

    public BookingService(BookingRepository bookingRepository,
                          PassengerRepository passengerRepository,
                          BusRouteRepository routeRepository) {
        this.bookingRepository = bookingRepository;
        this.passengerRepository = passengerRepository;
        this.routeRepository = routeRepository;
    }

    // used by BookingController (passenger + admin)
    public List<BookingResponse> getBookings(String bookingId, LocalDate date, Integer passengerId) {
        List<Booking> bookings;

        if (bookingId != null && !bookingId.trim().isEmpty()) {
            bookings = bookingRepository.findById(bookingId)
                    .map(Collections::singletonList)
                    .orElse(Collections.emptyList());
        } else {
            bookings = bookingRepository.findAll();
        }

        List<BookingResponse> out = new ArrayList<>();
        for (Booking b : bookings) {
            boolean booked = true;
            if (date != null && !date.equals(b.getDateOfJourney())) booked = false;
            if (passengerId != null && !passengerId.equals(b.getPassenger().getId())) booked = false;

            if (booked) out.add(toResponse(b));
        }
        return out;
    }

    @Transactional
    public BookingReceiptResponse book(int passengerId, int routeId, List<BookPassenger> passengers)
            throws RouteNotFound, SeatNotAvailable {

        Passenger passenger = passengerRepository.findById(passengerId)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));

        BusRoute route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RouteNotFound("Route not found!"));

        int seatsRequested = (passengers == null) ? 0 : passengers.size();
        if (seatsRequested <= 0) throw new IllegalArgumentException("No passengers added!");

        int updated = routeRepository.decrementSeats(routeId, seatsRequested);
        if (updated == 0) throw new SeatNotAvailable("Not enough seats available right now!");

        String bookingId = UUID.randomUUID().toString();
        double totalPrice = route.getPrice() * seatsRequested;

        Booking booking = new Booking();
        booking.setBookingId(bookingId);
        booking.setPassenger(passenger);
        booking.setRoute(route);
        booking.setSource(route.getSource());
        booking.setDestination(route.getDestination());
        booking.setDateOfJourney(route.getDateOfJourney());
        booking.setSeatNumbers(seatsRequested);
        booking.setTotalPrice(totalPrice);
        booking.setStatus(Bookings.Status.CONFIRMED);

        for (BookPassenger p : passengers) {
            if (p.getName() == null || p.getName().trim().isEmpty()
                    || p.getAge() <= 0
                    || p.getGender() == null || p.getGender().trim().isEmpty()) {
                throw new IllegalArgumentException("No field should be empty!");
            }
            booking.addBookedPassenger(new BookPassenger(p.getName(), p.getAge(), p.getGender()));
        }

        Booking saved = bookingRepository.save(booking);

        return new BookingReceiptResponse(
                saved.getBookingId(),
                saved.getPassenger().getId(),
                saved.getRoute().getRouteId(),
                saved.getSeatNumbers(),
                saved.getTotalPrice(),
                saved.getStatus().name()
        );
    }

    @Transactional
    public boolean cancelBooking(int passengerId, String bookingId) throws BookingNotFound {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new BookingNotFound("Booking not found!"));

        if (!booking.getPassenger().getId().equals(passengerId)) {
            throw new BookingNotFound("You can cancel your booking only!");
        }

        if (booking.getStatus() == Bookings.Status.CANCELLED) return false;

        routeRepository.incrementSeats(booking.getRoute().getRouteId(), booking.getSeatNumbers());
        booking.setStatus(Bookings.Status.CANCELLED);
        bookingRepository.save(booking);
        return true;
    }

    public StatsResponse viewStatistics() {
        long total = bookingRepository.count();
        long cancelled = bookingRepository.countByStatus(Bookings.Status.CANCELLED);
        double revenue = bookingRepository.revenue();
        return new StatsResponse(total, cancelled, revenue);
    }

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(
                b.getBookingId(),
                b.getPassenger().getId(),
                b.getRoute().getRouteId(),
                b.getSource(),
                b.getDestination(),
                b.getDateOfJourney(),
                b.getSeatNumbers(),
                b.getTotalPrice(),
                b.getStatus().name()
        );
    }
}
