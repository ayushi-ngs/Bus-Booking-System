package com.bus.controller;

import com.bus.config.AdminCredentialsProperties;
import com.bus.dto.AuthLoginRequest;
import com.bus.dto.AuthLoginResponse;
import com.bus.dto.PassengerResponse;
import com.bus.model.Passenger;
import com.bus.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

/**
 * Single login endpoint for both ADMIN and PASSENGER.
 *
 * Frontend will send email+password to /api/auth/login.
 * - If it matches admin credentials -> role=ADMIN
 * - Else if it matches passenger credentials -> role=PASSENGER (+ passenger details)
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AdminCredentialsProperties adminCreds;

    public AuthController(AuthService authService, AdminCredentialsProperties adminCreds) {
        this.authService = authService;
        this.adminCreds = adminCreds;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthLoginResponse> login(@RequestBody AuthLoginRequest req, HttpSession session) {
        String email = req.getEmail() == null ? "" : req.getEmail().trim();
        String password = req.getPassword() == null ? "" : req.getPassword();

        // 1) ADMIN check first (so admin cannot be "shadowed" by a passenger record)
        if (email.equalsIgnoreCase(adminCreds.getEmail()) && password.equals(adminCreds.getPassword())) {
            session.setAttribute("ROLE", "ADMIN");
            session.removeAttribute("PASSENGER_ID");
            return ResponseEntity.ok(AuthLoginResponse.admin());
        }

        // 2) PASSENGER check
        Passenger p = authService.loginPassenger(email, password);
        if (p == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        session.setAttribute("ROLE", "PASSENGER");
        session.setAttribute("PASSENGER_ID", p.getId());

        PassengerResponse passenger = new PassengerResponse(p.getId(), p.getName(), p.getEmail(), p.getPhone());
        return ResponseEntity.ok(AuthLoginResponse.passenger(passenger));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out");
    }
}