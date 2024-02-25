package Domain.Entities;

import Domain.Managers.OrdersManager;
import Utilities.DataProvider;

import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


public class Order implements Runnable {
    public static final String DELIVERIES_URL = "http://138.197.181.131:8080/deliveries";

    public enum Status {
        SEARCHING_FOR_DELIVERY,
        DELIVERY_ON_ITS_WAY,
        DELIVERED
    }

    private final String id;
    private final String userId;
    private Status status;
    private final Cart cart;
    private ScheduledExecutorService scheduler;

    public Order(Cart cart, String id, String userId) {
        this.id = id;
        this.userId = userId;
        this.cart = cart;
        this.status = Status.SEARCHING_FOR_DELIVERY;
    }

    private long calculateDeliveryTime(Delivery delivery) {
        double distance = delivery.getLocation().calculateDistance(new Location(0, 0)) +
                delivery.getLocation().calculateDistance(cart.getRestaurant().getLocation());
        return (long) distance/delivery.getVelocity();
    }

    private Delivery findClosestDelivery(ArrayList<Delivery> deliveries) {
        Delivery closestDelivery = deliveries.get(0);
        long minDistanceDeliveryTime = calculateDeliveryTime(closestDelivery);
        for(int i = 1; i < deliveries.size(); i++) {
            long deliveryTime = calculateDeliveryTime(deliveries.get(i));
            if(deliveryTime < minDistanceDeliveryTime) {
                minDistanceDeliveryTime = deliveryTime;
                closestDelivery = deliveries.get(i);
            }
        }
        return closestDelivery;
    }

    private ArrayList<Delivery> fetchDeliveriesInfo() {
        ArrayList<Delivery> allDeliveries;
//        String responseString = GetRequest.sendGetRequest(DeliveriesRepository.DELIVERIES_URL);
//        try {
//            allDeliveries = new ArrayList<>(Arrays.asList(new ObjectMapper().readValue(responseString, Delivery[].class)));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        allDeliveries = DataProvider.getDeliveries();
        return allDeliveries.stream().filter(element -> !element.isBusy).collect(Collectors.toCollection(ArrayList::new));
    }

    @Override
    public void run() {
        if (scheduler == null) scheduler = Executors.newSingleThreadScheduledExecutor();
        if (status == Status.SEARCHING_FOR_DELIVERY) {
            ArrayList<Delivery> deliveries = fetchDeliveriesInfo();
            if(deliveries.isEmpty()) {
                scheduler.schedule(this, 30, TimeUnit.SECONDS);
            }
            else {
                status = Status.DELIVERY_ON_ITS_WAY;
                Delivery delivery = findClosestDelivery(deliveries);
                long deliveryTime = calculateDeliveryTime(delivery);
                OrdersManager.getInstance().updateOrderStatus(this);
                scheduler.schedule(this, deliveryTime, TimeUnit.SECONDS);
            }
        }
        else {
            status = Status.DELIVERED;
            OrdersManager.getInstance().updateOrderStatus(this);
            scheduler.shutdownNow();
        }
    }

    public Status getStatus() {
        return status;
    }

    public Cart getCart() {
        return cart;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

}
