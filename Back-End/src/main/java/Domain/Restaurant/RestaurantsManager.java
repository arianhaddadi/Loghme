package Domain.Restaurant;

import Entities.Food;
import Entities.FoodPartyFood;
import Entities.Restaurant;
import Mappers.Food.FoodMapper;
import Mappers.FoodPartyFood.FoodPartyFoodMapper;
import Mappers.Restaurant.RestaurantMapper;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

public class RestaurantsManager {
    public static String RESTAURANTS_SERVER_URL = "http://138.197.181.131:8080/restaurants";
    public static int maxDistance;
    private static RestaurantsManager instance;

    private RestaurantMapper restaurantMapper;
    private FoodMapper foodMapper;
    private FoodPartyFoodMapper foodPartyFoodMapper;

    public FoodPartyFoodMapper getFoodPartyFoodMapper() {
        return foodPartyFoodMapper;
    }

    private RestaurantsManager() {
        restaurantMapper = RestaurantMapper.getInstance();
        foodMapper = FoodMapper.getInstance();
        foodPartyFoodMapper = FoodPartyFoodMapper.getInstance();
    }

    public static RestaurantsManager getInstance() {
        if (instance == null) {
            instance = new RestaurantsManager();
        }
        return instance;
    }

    private ArrayList<Restaurant> convertRestaurantDAOsListToRestaurantsList (ArrayList<RestaurantDAO> restaurantDAOS) {
        ArrayList<Restaurant> restaurants = new ArrayList<>();
        for (RestaurantDAO restaurantDAO : restaurantDAOS) {
            Restaurant restaurant = restaurantDAO.getRestaurantForm();
            restaurant.setMenu(convertFoodDAOListToFoodList(foodMapper.findAll(restaurant.getId(), null, null)));
            restaurant.setFoodPartyMenu(convertFoodPartyFoodDAOListToFoodPartyFoodList(foodPartyFoodMapper.findAll(restaurant.getId(), null, null)));
            restaurants.add(restaurant);
        }
        return restaurants;
    }

    public ArrayList<Restaurant> getRestaurants(Integer pageSize, Integer pageNum) {
        if (pageSize != null && pageNum != null) {
            return convertRestaurantDAOsListToRestaurantsList(restaurantMapper.findAll( "",
                                                                                        (pageNum - 1) * pageSize,
                                                                                         pageSize));
        }
        else {
            return convertRestaurantDAOsListToRestaurantsList(restaurantMapper.findAll( "",null, null));
        }
    }

    public ArrayList<Restaurant> getFoodPartyRestaurants() {
        ArrayList<Restaurant> foodpartyRestaurants = new ArrayList<>();
        for(Restaurant restaurant : getRestaurants(null, null)) {
            if (restaurant.getFoodPartyMenu() != null && restaurant.getFoodPartyMenu().size() != 0) {
                foodpartyRestaurants.add(restaurant);
            }
        }
        return foodpartyRestaurants;
    }

    private void insertRestaurant(Restaurant restaurant) {
        restaurantMapper.insert(new RestaurantDAO(restaurant));
    }

    private void insertRestaurantMenu(Restaurant restaurant) {
        if (restaurant.getMenu() != null && restaurant.getMenu().size() != 0) {
            for (Food food : restaurant.getMenu()) {
                foodMapper.insert(new FoodDAO(food, restaurant));
            }
        }
    }

    private void insertRestaurantFoodPartyMenu(Restaurant restaurant) {
        if (restaurant.getFoodPartyMenu() != null && restaurant.getFoodPartyMenu().size() != 0) {
            for (FoodPartyFood foodPartyFood : restaurant.getFoodPartyMenu()) {
                foodPartyFoodMapper.insert(new FoodPartyFoodDAO(foodPartyFood, restaurant));
            }
        }
    }

    public void updateFoodPartyFood(FoodPartyFood foodPartyFood, Restaurant restaurant) {
        FoodPartyFoodDAO foodPartyFoodDAO = new FoodPartyFoodDAO(foodPartyFood, restaurant);
        foodPartyFoodMapper.update(foodPartyFoodDAO);
    }

    public void setRestaurants(ArrayList<Restaurant> restaurants) {
        for (Restaurant restaurant : restaurants) {
            insertRestaurant(restaurant);
            insertRestaurantMenu(restaurant);
            insertRestaurantFoodPartyMenu(restaurant);
        }
    }

    private ArrayList<Food> convertFoodDAOListToFoodList(ArrayList<FoodDAO> foodDAOS) {
        if (foodDAOS != null) {
            ArrayList<Food> foods = new ArrayList<>();
            for (FoodDAO foodDAO : foodDAOS) {
                foods.add(foodDAO.getFoodForm());
            }
            return foods;
        }
        else {
            return null;
        }
    }

    public ArrayList<Restaurant> search(String foodName, String restaurantName, int pageSize, int pageNum) {
        return convertRestaurantDAOsListToRestaurantsList(restaurantMapper.findByNameAndMenu(foodName, restaurantName,
                                                                                   (pageNum - 1) * pageSize, pageSize));
    }

    private ArrayList<FoodPartyFood> convertFoodPartyFoodDAOListToFoodPartyFoodList(ArrayList<FoodPartyFoodDAO> foodPartyFoodDAOS) {
        if (foodPartyFoodDAOS != null) {
            ArrayList<FoodPartyFood> foodPartyFoods = new ArrayList<>();
            for (FoodPartyFoodDAO foodPartyFoodDAO : foodPartyFoodDAOS) {
                foodPartyFoods.add(foodPartyFoodDAO.getFoodPartyFoodForm());
            }
            return foodPartyFoods;
        }
        else {
            return null;
        }
    }

    public Restaurant getRestaurantById(String id) {
        RestaurantDAO restaurantDAO = restaurantMapper.find(id);
        if (restaurantDAO != null) {
            Restaurant restaurant = restaurantDAO.getRestaurantForm();
            restaurant.setMenu(convertFoodDAOListToFoodList(foodMapper.findAll(id, null, null)));
            restaurant.setFoodPartyMenu(convertFoodPartyFoodDAOListToFoodPartyFoodList(foodPartyFoodMapper.findAll(id, null, null)));
            return restaurant;
        }
        else {
            return null;
        }
    }

    public Food getFoodById(String id) {
        FoodDAO foodDAO = FoodMapper.getInstance().find(id);
        Food food;
        if(foodDAO == null) {
            FoodPartyFoodDAO foodPartyFoodDAO = FoodPartyFoodMapper.getInstance().find(id);
            food = foodPartyFoodDAO.getFoodPartyFoodForm();
        }
        else {
            food = foodDAO.getFoodForm();
        }
        return food;
    }

    public ArrayList<Restaurant> parseListOfJson(String input) {
        try {
            ArrayList<Restaurant> restaurants = new ArrayList<>(Arrays.asList(new ObjectMapper().readValue(input, Restaurant[].class)));
            return restaurants;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
