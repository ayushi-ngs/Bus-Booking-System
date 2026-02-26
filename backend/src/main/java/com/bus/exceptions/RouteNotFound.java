package com.bus.exceptions;

public class RouteNotFound extends RuntimeException {
    public RouteNotFound(String message) {
        super(message);
    }
}
