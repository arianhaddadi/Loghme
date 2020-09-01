package Entities;

import Domain.Order.OrdersManager;
import Repositories.DeliveriesRepository;
import Utilities.Request.GetRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


public class Order implements Runnable{

    public enum Status {
        SEARCHING_FOR_DELIVERY,
        DELIVERY_ON_ITS_WAY,
        DELIVERED
    }

    private String id;
    private String userId;
    private Status status;
    private Cart cart;
    private ScheduledExecutorService scheduler;
    private Delivery assignedDelivery;
    private long deliveryTime;
    private long deliveryStartTime;


    public Order(Cart cart, String id, String userId) {
        this.id = id;
        this.userId = userId;
        this.cart = cart;
        this.status = Status.SEARCHING_FOR_DELIVERY;
        deliveryStartTime = 0;
    }

    private long calculateDeliveryTime(Delivery delivery) {
        double distance = delivery.getLocation().calculateDistance(new Location(0, 0)) +
                delivery.getLocation().calculateDistance(cart.getRestaurant().getLocation());
        return (long) distance/delivery.getVelocity();
    }

    private Delivery findBestDelivery(ArrayList<Delivery> deliveries) {
        Delivery bestDelivery = deliveries.get(0);
        long minDistanceDeliveryTime = calculateDeliveryTime(bestDelivery), deliveryTime;
        for(int i = 1; i < deliveries.size(); i++) {
            deliveryTime = calculateDeliveryTime(deliveries.get(i));
            if(deliveryTime < minDistanceDeliveryTime) {
                minDistanceDeliveryTime = deliveryTime;
                bestDelivery = deliveries.get(i);
            }
        }
        return bestDelivery;
    }

    private void assignDelivery(ArrayList<Delivery> deliveries) {
        while(true) {
            Delivery bestDelivery = findBestDelivery(deliveries);
            if(bestDelivery.isAlreadyBusy()) {
                deliveries.remove(bestDelivery);
            }
            else {
                assignedDelivery = bestDelivery;
                break;
            }
        }
    }

    private Boolean allDeliveriesBusy(ArrayList<Delivery> deliveries) {
        for(Delivery delivery : deliveries) {
            if(!delivery.isAlreadyBusy())
                return false;
        }
        return true;
    }

    @Override
    public void run() {
        if (status == Status.SEARCHING_FOR_DELIVERY) {
            GetRequest getRequest = new GetRequest(DeliveriesRepository.getApiUrl());
            getRequest.send();
            try {
                ArrayList<Delivery> deliveries = new ArrayList<>(Arrays.asList(new ObjectMapper().readValue(getRequest.getResponseString(), Delivery[].class)));
                scheduler = Executors.newSingleThreadScheduledExecutor();
                if((deliveries.size() == 0) || (allDeliveriesBusy(deliveries))) {
                    scheduler.schedule(this, 30, TimeUnit.SECONDS);
                }
                else {
                    status = Status.DELIVERY_ON_ITS_WAY;
                    assignDelivery(deliveries);
                    deliveryStartTime = System.currentTimeMillis() / 1000L;
                    DeliveriesRepository.getInstance().getOnTheWayDeliveries().add(assignedDelivery);
                    deliveryTime = calculateDeliveryTime(assignedDelivery);
                    OrdersManager.getInstance().updateOrderStatus(this);
                    scheduler.schedule(this, deliveryTime, TimeUnit.SECONDS);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        else {
            status = Status.DELIVERED;
            OrdersManager.getInstance().updateOrderStatus(this);
            DeliveriesRepository.getInstance().getOnTheWayDeliveries().remove(assignedDelivery);
        }
    }

    private String calculateRemainingTime() {
        long seconds = deliveryTime - (System.currentTimeMillis() / 1000L) + deliveryStartTime;
        long hours = seconds / 3600L;
        seconds = seconds - hours * 3600L;
        long minutes = seconds / 60L;
        seconds = seconds - minutes * 60L;
        String time;
        if((hours == 0) && (minutes == 0)) {
            time = String.format("%ds", seconds);
        }
        else if(hours == 0) {
            time = String.format("%dm %ds", minutes, seconds);
        }
        else {
            time = String.format("%dh %dm %ds", hours, minutes, seconds);
        }
        return time;
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

    public long getDeliveryStartTime() {
        return deliveryStartTime;
    }

    public long getDeliveryTime() {
        return deliveryTime;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setDeliveryTime(long deliveryTime) {
        this.deliveryTime = deliveryTime;
    }

    public void setDeliveryStartTime(long deliveryStartTime) {
        this.deliveryStartTime = deliveryStartTime;
    }
}
