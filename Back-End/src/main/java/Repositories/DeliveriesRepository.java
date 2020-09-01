package Repositories;

import Entities.Delivery;

import java.util.ArrayList;

public class DeliveriesRepository {
    private ArrayList<Delivery> onTheWayDeliveries;
    private static DeliveriesRepository ourInstance = new DeliveriesRepository();
    private final static String API_URL = "http://138.197.181.131:8080/deliveries";

    public static DeliveriesRepository getInstance() {
        return ourInstance;
    }

    private DeliveriesRepository() {
        onTheWayDeliveries = new ArrayList<>();
    }

    public static String getApiUrl() {
        return API_URL;
    }

    public ArrayList<Delivery> getOnTheWayDeliveries() {
        return onTheWayDeliveries;
    }

}
