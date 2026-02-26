package com.bus.dto;

public class AddRouteRequest {
    private String source;
    private String destination;
    private String arrivalTime;    // HH:mm
    private String departureTime;  // HH:mm
    private String dateOfJourney;  // yyyy-MM-dd
    private Integer totalSeats;
    private Double price;

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getDateOfJourney() { return dateOfJourney; }
    public void setDateOfJourney(String dateOfJourney) { this.dateOfJourney = dateOfJourney; }

    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
