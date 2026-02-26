package com.bus.exceptions;

public class SeatNotAvailable extends RuntimeException {
    public SeatNotAvailable(String message) {
        super(message);
    }
}
