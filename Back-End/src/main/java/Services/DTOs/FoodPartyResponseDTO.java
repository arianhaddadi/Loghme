package Services.DTOs;

import Domain.Entities.Restaurant;

import java.util.ArrayList;

public class FoodPartyResponseDTO {
    private final int remainingMinutes;
    private final int remainingSeconds;
    private final ArrayList<Restaurant> restaurants;

    public FoodPartyResponseDTO(
            int remainingMinutes, int remainingSeconds, ArrayList<Restaurant> restaurants) {
        this.remainingMinutes = remainingMinutes;
        this.remainingSeconds = remainingSeconds;
        this.restaurants = restaurants;
    }

    public int getRemainingMinutes() {
        return remainingMinutes;
    }

    public int getRemainingSeconds() {
        return remainingSeconds;
    }

    public ArrayList<Restaurant> getRestaurants() {
        return restaurants;
    }
}
