package com.bus.dto;

import java.time.LocalDate;

public class BookingResponse {
    private String bookingId;
    private int passengerId;
    private int routeId;
    private String source;
    private String destination;
    private LocalDate dateOfJourney;
    private int seatNumbers;
    private double totalPrice;
    private String status;

    public BookingResponse(String bookingId, int passengerId, int routeId,
                           String source, String destination, LocalDate dateOfJourney,
                           int seatNumbers, double totalPrice, String status) {
        this.bookingId = bookingId;
        this.passengerId = passengerId;
        this.routeId = routeId;
        this.source = source;
        this.destination = destination;
        this.dateOfJourney = dateOfJourney;
        this.seatNumbers = seatNumbers;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public String getBookingId() { return bookingId; }
    public int getPassengerId() { return passengerId; }
    public int getRouteId() { return routeId; }
    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public LocalDate getDateOfJourney() { return dateOfJourney; }
    public int getSeatNumbers() { return seatNumbers; }
    public double getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
}
