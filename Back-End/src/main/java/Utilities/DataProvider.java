package Utilities;

import Domain.Entities.*;

import java.util.ArrayList;
import java.util.Arrays;

public class DataProvider {

    public static ArrayList<Food> getFoodItems() {
        Food f1 = new Food("f1", "good f1", "im1", 1.0F, 1.0F);
        Food f2 = new Food("f2", "good f2", "im2", 2.0F, 2.0F);
        Food f3 = new Food("f3", "good f3", "im3", 3.0F, 3.0F);
        Food f4 = new Food("f4", "good f4", "im4", 4.0F, 4.0F);
        Food f5 = new Food("f5", "good f5", "im5", 5.0F, 5.0F);
        return new ArrayList<>(Arrays.asList(f1, f2, f3, f4, f5));
    }

    public static ArrayList<FoodPartyFood> getFoodPartyItems() {
        FoodPartyFood f1 = new FoodPartyFood("f1", "good f1", "im1", 1.0F, 1.0F, 3, 2.0F);
        FoodPartyFood f2 = new FoodPartyFood("f2", "good f2", "im2", 2.0F, 2.0F, 3, 2.0F);
        FoodPartyFood f3 = new FoodPartyFood("f3", "good f3", "im3", 3.0F, 3.0F, 3, 2.0F);
        FoodPartyFood f4 = new FoodPartyFood("f4", "good f4", "im4", 4.0F, 4.0F, 3, 2.0F);
        FoodPartyFood f5 = new FoodPartyFood("f5", "good f5", "im5", 5.0F, 5.0F, 3, 2.0F);
        return new ArrayList<>(Arrays.asList(f1, f2, f3, f4, f5));
    }

    public static ArrayList<Restaurant> getRestaurants() {
        ArrayList<Food> foodItems = getFoodItems();
        ArrayList<FoodPartyFood> foodPartyItems = getFoodPartyItems();

        Restaurant r1 =
                new Restaurant(
                        "r1",
                        "rest1",
                        "logo1",
                        new Location(1.0F, 1.0F),
                        foodItems,
                        foodPartyItems);
        Restaurant r2 =
                new Restaurant(
                        "r2",
                        "rest2",
                        "logo2",
                        new Location(2.0F, 2.0F),
                        foodItems,
                        foodPartyItems);
        Restaurant r3 =
                new Restaurant(
                        "r3",
                        "rest3",
                        "logo3",
                        new Location(3.0F, 3.0F),
                        foodItems,
                        foodPartyItems);
        Restaurant r4 =
                new Restaurant(
                        "r4",
                        "rest4",
                        "logo4",
                        new Location(4.0F, 4.0F),
                        foodItems,
                        foodPartyItems);

        return new ArrayList<>(Arrays.asList(r1, r2, r3, r4));
    }

    public static ArrayList<Delivery> getDeliveries() {
        Delivery d1 = new Delivery("d1", 1, new Location(20.0F, 20.0F));
        Delivery d2 = new Delivery("d2", 2, new Location(40.0F, 40.0F));
        Delivery d3 = new Delivery("d3", 3, new Location(60.0F, 60.0F));

        return new ArrayList<>(Arrays.asList(d1, d2, d3));
    }
}
