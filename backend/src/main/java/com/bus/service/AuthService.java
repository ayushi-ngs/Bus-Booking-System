package com.bus.service;

import com.bus.config.AdminCredentialsProperties;
import com.bus.model.Passenger;
import com.bus.repository.PassengerRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final PassengerRepository passengerRepository;
    private final AdminCredentialsProperties adminCreds;

    public AuthService(PassengerRepository passengerRepository, AdminCredentialsProperties adminCreds) {
        this.passengerRepository = passengerRepository;
        this.adminCreds = adminCreds;
    }

    public int registerPassenger(String name, String email, long phone, String password) {
        if (name == null || name.trim().isEmpty()
                || email == null || email.trim().isEmpty()
                || password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("All fields are required!");
        }

        // prevent passengers from registering using admin's email
        if (email != null && adminCreds.getEmail() != null && email.trim().equalsIgnoreCase(adminCreds.getEmail().trim())) {
            throw new IllegalArgumentException("This email is reserved. Please use a different email.");
        }

        if (passengerRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered!");
        }

        Passenger saved = passengerRepository.save(new Passenger(name, email, phone, password));
        return saved.getId();
    }

    /** Passenger login only (admin login is handled in AuthController). */
    public Passenger loginPassenger(String email, String password) {
        return passengerRepository.findByEmailAndPassword(email, password).orElse(null);
    }
}