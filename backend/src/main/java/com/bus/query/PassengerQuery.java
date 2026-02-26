package com.bus.query;

public class PassengerQuery {
    public static String registerPassenger= "insert into Passenger(name,email,phone,password)" +
            " values(?,?,?,?)";
    public static String loginPassenger="select * from Passenger where email=? AND password=?";
    public static String insertBookedPassenger= "insert into Book_Passenger" +
            " (booking_id, name, age, gender) " + "values (?, ?, ?, ?)";
}
