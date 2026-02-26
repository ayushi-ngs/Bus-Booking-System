package com.bus.repository;

import com.bus.model.Passenger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PassengerRepository extends JpaRepository<Passenger, Integer> {
    Optional<Passenger> findByEmailAndPassword(String email, String password);
    boolean existsByEmail(String email);
}
