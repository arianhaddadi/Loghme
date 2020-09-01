package Entities;

import Repositories.DeliveriesRepository;

public class Delivery {
    private String id;
    private long velocity;
    private Location location;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public long getVelocity() {
        return velocity;
    }

    public void setVelocity(long velocity) {
        this.velocity = velocity;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public boolean isAlreadyBusy() {
        for(Delivery delivery : DeliveriesRepository.getInstance().getOnTheWayDeliveries()) {
            if(delivery.id.equals(this.id)) {
                return true;
            }
        }
        return false;
    }
}
