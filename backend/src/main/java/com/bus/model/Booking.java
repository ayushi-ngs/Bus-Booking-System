package com.bus.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Booking")
public class Booking {

    @Id
    @Column(name = "booking_id", length = 36)
    private String bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passenger_id", nullable = false)
    private Passenger passenger;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id", nullable = false)
    private BusRoute route;

    @Column(name = "source", nullable = false, length = 100)
    private String source;

    @Column(name = "destination", nullable = false, length = 100)
    private String destination;

    @Column(name = "date_of_journey", nullable = false)
    private LocalDate dateOfJourney;

    @Column(name = "seat_numbers", nullable = false)
    private Integer seatNumbers;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Bookings.Status status;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookPassenger> bookedPassengers = new ArrayList<>();

    public Booking() {}

    public String getBookingId() { return bookingId; }
    public Passenger getPassenger() { return passenger; }
    public BusRoute getRoute() { return route; }
    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public LocalDate getDateOfJourney() { return dateOfJourney; }
    public Integer getSeatNumbers() { return seatNumbers; }
    public Double getTotalPrice() { return totalPrice; }
    public Bookings.Status getStatus() { return status; }
    public List<BookPassenger> getBookedPassengers() { return bookedPassengers; }

    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public void setPassenger(Passenger passenger) { this.passenger = passenger; }
    public void setRoute(BusRoute route) { this.route = route; }
    public void setSource(String source) { this.source = source; }
    public void setDestination(String destination) { this.destination = destination; }
    public void setDateOfJourney(LocalDate dateOfJourney) { this.dateOfJourney = dateOfJourney; }
    public void setSeatNumbers(Integer seatNumbers) { this.seatNumbers = seatNumbers; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public void setStatus(Bookings.Status status) { this.status = status; }

    public void addBookedPassenger(BookPassenger p) {
        bookedPassengers.add(p);
        p.setBooking(this);
    }
}
