package com.bus.dto;

import java.util.List;

public class BookingRequest {
    private List<SeatPassengerRequest> passengers;

    public List<SeatPassengerRequest> getPassengers() { return passengers; }
    public void setPassengers(List<SeatPassengerRequest> passengers) { this.passengers = passengers; }
}
