package com.bus.security;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpSession;

/**
 * Helper for session-based authentication.
 */
public final class SessionAuth {

    private SessionAuth() {}

    public static void requireAdmin(HttpSession session) {
        Object role = session.getAttribute("ROLE");
        if (role == null || !"ADMIN".equals(role.toString())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Admin login required");
        }
    }

    public static int requirePassengerId(HttpSession session) {
        Object role = session.getAttribute("ROLE");
        Object pid = session.getAttribute("PASSENGER_ID");

        if (role == null || !"PASSENGER".equals(role.toString()) || pid == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Passenger login required");
        }
        return (Integer) pid;
    }

    public static String currentRole(HttpSession session) {
        Object role = session.getAttribute("ROLE");
        return role == null ? null : role.toString();
    }
}