package Domain.Restaurant;

import Entities.Location;
import Entities.Restaurant;

public class RestaurantDAO {
    private String id, name, logo;
    private Location location;

    public RestaurantDAO() {
        return;
    }

    public RestaurantDAO(Restaurant restaurant) {
        this.id = restaurant.getId();
        this.name = restaurant.getName();
        this.logo = restaurant.getLogo();
        this.location = restaurant.getLocation();
    }

    public Restaurant getRestaurantForm() {
        return new Restaurant(id, name, logo, location);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }
}
