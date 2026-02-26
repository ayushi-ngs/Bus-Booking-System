package com.bus.service;

import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Small wrapper around Spring Boot's DataSource.
 * Keeps your JDBC logic almost unchanged.
 */
@Component
public class DataBaseService {

    private final DataSource dataSource;

    public DataBaseService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}
