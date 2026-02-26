package com.bus.model;

import javax.persistence.*;

@Entity
@Table(name = "Book_Passenger")
public class BookPassenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String gender;

    public BookPassenger() {}

    public BookPassenger(String name, Integer age, String gender) {
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    public Long getId() { return id; }
    public Booking getBooking() { return booking; }
    public String getName() { return name; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }

    public void setBooking(Booking booking) { this.booking = booking; }
}
