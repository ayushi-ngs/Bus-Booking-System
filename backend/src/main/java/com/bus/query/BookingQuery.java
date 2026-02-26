package com.bus.query;

public class BookingQuery {

    public static String getBookings = "select * from Booking";

    public static class AdminQuery{
        public static String totalBookings = "select count(*) as totalBookings from Booking";
        public static String cancelledBookings =
                "select count(*) as cancelledBookings from Booking where status = 'CANCELLED'";
        public static String revenue =
                "select sum(total_price) as revenue from Booking where status!='CANCELLED'";


    }
    public static class PassengerQuery{
        public static String insertBooking =
                "insert into Booking (booking_id, passenger_id, route_id, source, destination, " +
                        "date_of_journey, seat_numbers, total_price, status) " +
                        "values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        public static String findBooking = "select booking_id, passenger_id, route_id, seat_numbers" +
                ", status from Booking where booking_id = ?";

        public static String updateBookingStatus = "update Booking set status = ? where booking_id = ?";
    }

}
