package com.bus.query;

public class RouteQuery {

    public static class AdminQuery{
        public static  String addRoutes = "insert into Route(source,destination" +
                ",arrival_time,departure_time,date_of_journey,total_seats,available_seats,price) " +
                "values(?,?,?,?,?,?,?,?)";
    }

    public static class PassengerQuery{
        public static String searchBusRoute = "select * from Route where source=? " +
                "and destination=? and date_of_journey=?";
        public static String selectRoute = "select * from Route where route_id = ?";

        public static String updateSeats = "update Route set available_seats" +
                " = available_seats - ? where route_id = ? and available_seats >= ?";
        public static String addBackSeats =
                "update Route set available_seats = available_seats + ? where route_id = ?";

    }

}
