package com.bus.controller;

import com.bus.dto.PassengerRegisterRequest;
import com.bus.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/passengers")
public class PassengerAuthController {

    private final AuthService authService;

    public PassengerAuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody PassengerRegisterRequest req) {
        int id = authService.registerPassenger(
                req.getName(),
                req.getEmail(),
                req.getPhone() == null ? 0L : req.getPhone(),
                req.getPassword()
        );
        return ResponseEntity.status(201)
                .body("Passenger registered successfully. passengerId=" + id);
    }
}