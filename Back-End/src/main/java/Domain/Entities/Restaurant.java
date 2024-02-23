package Domain.Entities;

import java.util.ArrayList;

public class Restaurant {
    private String id, name, logo;
    private Location location;
    private ArrayList<Food> menu;
    private ArrayList<FoodPartyFood> foodPartyMenu;

    public Restaurant(String id, String name, String logo, Location location,
                      ArrayList<Food> menu, ArrayList<FoodPartyFood> foodPartyMenu) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.location = location;
        this.menu = menu;
        this.foodPartyMenu = foodPartyMenu;
    }

    public Restaurant(String id, String name, String logo, Location location) {
        this.id = id;
        this.name = name;
        this.logo = logo;
        this.location = location;
    }

    public Food getFoodByName(String name) {
        if(menu == null) return null;
        for(Food food : menu) {
            if (food.getName().equals(name))
                return food;
        }
        return null;
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

    public ArrayList<Food> getMenu() {
        return menu;
    }

    public void setMenu(ArrayList<Food> menu) {
        this.menu = menu;
    }

    public ArrayList<FoodPartyFood> getFoodPartyMenu() {
        return foodPartyMenu;
    }

    public void setFoodPartyMenu(ArrayList<FoodPartyFood> foodPartyMenu) {
        this.foodPartyMenu = foodPartyMenu;
    }

    public FoodPartyFood getFoodPartyFoodByName(String foodName) {
        if(foodPartyMenu == null) return null;
        for(FoodPartyFood foodPartyFood : foodPartyMenu) {
            if(foodPartyFood.getName().equals(foodName)) {
                return foodPartyFood;
            }
        }
        return null;
    }

    public Food getFoodOrFoodPartyByName(Boolean isFoodPartyFood, String foodName) {
        if(isFoodPartyFood) {
            return getFoodPartyFoodByName(foodName);
        }
        else {
            return getFoodByName(foodName);
        }
    }
}