package Domain.Entities;

public class Delivery {
    private String id;
    private long velocity;
    private Location location;
    boolean isBusy = false;
    public Delivery(String id, long velocity, Location location) {
        this.id = id;
        this.velocity = velocity;
        this.location = location;
    }

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
}
