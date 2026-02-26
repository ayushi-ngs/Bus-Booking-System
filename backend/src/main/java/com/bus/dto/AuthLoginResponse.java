package com.bus.dto;

public class AuthLoginResponse {

    private String role;
    private PassengerResponse passenger; // nullable

    public AuthLoginResponse() {}

    public AuthLoginResponse(String role, PassengerResponse passenger) {
        this.role = role;
        this.passenger = passenger;
    }

    public static AuthLoginResponse admin() {
        return new AuthLoginResponse("ADMIN", null);
    }

    public static AuthLoginResponse passenger(PassengerResponse passenger) {
        return new AuthLoginResponse("PASSENGER", passenger);
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public PassengerResponse getPassenger() {
        return passenger;
    }

    public void setPassenger(PassengerResponse passenger) {
        this.passenger = passenger;
    }
}