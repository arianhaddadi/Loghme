package Domain.Managers;

import Domain.Entities.Delivery;
import java.util.ArrayList;

public class DeliveriesManager {
    private final ArrayList<Delivery> onTheWayDeliveries = new ArrayList<>();
    private static final DeliveriesManager instance = new DeliveriesManager();
    public static final String DELIVERIES_URL = "http://138.197.181.131:8080/deliveries";
    public static DeliveriesManager getInstance() {
        return instance;
    }
    public ArrayList<Delivery> getOnTheWayDeliveries() {
        return onTheWayDeliveries;
    }

//    public void addToOn
}
