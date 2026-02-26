package com.bus.dto;

public class StatsResponse {
    private long totalBookings;
    private long cancelledBookings;
    private double revenue;

    public StatsResponse(long totalBookings, long cancelledBookings, double revenue) {
        this.totalBookings = totalBookings;
        this.cancelledBookings = cancelledBookings;
        this.revenue = revenue;
    }

    public long getTotalBookings() { return totalBookings; }
    public long getCancelledBookings() { return cancelledBookings; }
    public double getRevenue() { return revenue; }
}
