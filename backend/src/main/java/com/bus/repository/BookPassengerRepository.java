package com.bus.repository;
//
import com.bus.model.BookPassenger;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookPassengerRepository extends JpaRepository<BookPassenger, Long> {
}
