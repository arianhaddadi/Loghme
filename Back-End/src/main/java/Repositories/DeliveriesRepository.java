package Repositories;

import Domain.Entities.Delivery;
import java.util.ArrayList;

public class DeliveriesRepository {
    private final ArrayList<Delivery> onTheWayDeliveries = new ArrayList<>();
    private static final DeliveriesRepository instance = new DeliveriesRepository();
    public final static String DELIVERIES_URL = "http://138.197.181.131:8080/deliveries";
    public static DeliveriesRepository getInstance() {
        return instance;
    }
    public ArrayList<Delivery> getOnTheWayDeliveries() {
        return onTheWayDeliveries;
    }

}
