package com.bus.repository;

import com.bus.model.Booking;
import com.bus.model.Bookings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, String> {

    long countByStatus(Bookings.Status status);

    @Query("select coalesce(sum(b.totalPrice), 0.0) from Booking b where b.status <> :cancelled")
    Double revenueExcluding(@Param("cancelled") Bookings.Status cancelled);

    default double revenue() {
        Double v = revenueExcluding(Bookings.Status.CANCELLED);
        return v == null ? 0.0 : v;
    }
}
