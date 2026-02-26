package com.bus.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class SeatBooking implements Serializable {

    private String bookingId;
    private List<BookPassenger> passengers;

    public SeatBooking() {
        this.bookingId = UUID.randomUUID().toString();
        this.passengers = new ArrayList<>();
    }

    public void addPassenger(BookPassenger passenger) {
        if (passenger == null) {
            throw new IllegalArgumentException("Passenger detail is null!");
        }
        passengers.add(passenger);
    }

    public int getNumberOfSeats() {
        return passengers.size();
    }

    public List<BookPassenger> getPassengers() {
        return passengers;
    }

    public String getBookingId() {
        return bookingId;
    }
}
