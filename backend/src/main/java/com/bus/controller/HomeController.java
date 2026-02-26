package com.bus.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
    @GetMapping("/")
    public String home() {
        return "Bus Booking System API is running. Try /api/routes/search, /api/passengers/register, /api/auth/login";
    }
}