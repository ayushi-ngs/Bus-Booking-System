package com.bus.dto;

public class BookingReceiptResponse {
    private String bookingId;
    private int passengerId;
    private int routeId;
    private int seats;
    private double totalPrice;
    private String status;

    public BookingReceiptResponse(String bookingId, int passengerId, int routeId, int seats, double totalPrice, String status) {
        this.bookingId = bookingId;
        this.passengerId = passengerId;
        this.routeId = routeId;
        this.seats = seats;
        this.totalPrice = totalPrice;
        this.status = status;
    }

    public String getBookingId() { return bookingId; }
    public int getPassengerId() { return passengerId; }
    public int getRouteId() { return routeId; }
    public int getSeats() { return seats; }
    public double getTotalPrice() { return totalPrice; }
    public String getStatus() { return status; }
}
