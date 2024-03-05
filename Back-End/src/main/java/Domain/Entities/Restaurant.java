package Domain.Entities;

import java.util.ArrayList;

public class Restaurant {
    private String id;
    private String name;
    private String logo;
    private Location location;
    private ArrayList<Food> menu = new ArrayList<>();
    private ArrayList<FoodPartyFood> foodPartyMenu = new ArrayList<>();

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

    public Food getFoodByName(Boolean isFoodPartyFood, String foodName) {
        if(isFoodPartyFood) {
            return getFoodPartyFoodByName(foodName);
        }
        else {
            return getFoodByName(foodName);
        }
    }

    private Food getFoodByName(String name) {
        for(Food food : menu) {
            if (food.getName().equals(name))
                return food;
        }
        return null;
    }

    private FoodPartyFood getFoodPartyFoodByName(String foodName) {
        for(FoodPartyFood foodPartyFood : foodPartyMenu) {
            if(foodPartyFood.getName().equals(foodName)) {
                return foodPartyFood;
            }
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
}
