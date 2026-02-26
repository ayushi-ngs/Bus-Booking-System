package com.bus.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Route")
public class BusRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Integer routeId;

    @Column(name = "source", nullable = false, length = 30)
    private String source;

    @Column(name = "destination", nullable = false, length = 30)
    private String destination;

    @Column(name = "arrival_time")
    private LocalTime arrivalTime;

    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @Column(name = "date_of_journey", nullable = false)
    private LocalDate dateOfJourney;

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(nullable = false)
    private Double price;

    public BusRoute() {}

    public Integer getRouteId() { return routeId; }
    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public LocalTime getArrivalTime() { return arrivalTime; }
    public LocalTime getDepartureTime() { return departureTime; }
    public LocalDate getDateOfJourney() { return dateOfJourney; }
    public Integer getTotalSeats() { return totalSeats; }
    public Integer getAvailableSeats() { return availableSeats; }
    public Double getPrice() { return price; }

    public void setSource(String source) { this.source = source; }
    public void setDestination(String destination) { this.destination = destination; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }
    public void setDateOfJourney(LocalDate dateOfJourney) { this.dateOfJourney = dateOfJourney; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public void setPrice(Double price) { this.price = price; }
}
