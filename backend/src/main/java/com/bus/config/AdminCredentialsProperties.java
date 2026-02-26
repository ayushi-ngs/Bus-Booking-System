package com.bus.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Admin credentials are kept in configuration (application.yml / env vars)
 * so they are NOT hardcoded in Java code.
 */
@Component
@ConfigurationProperties(prefix = "app.admin")
public class AdminCredentialsProperties {

    /** admin email (username) */
    private String email;

    /** admin password */
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}