package Domain.Managers;

import Domain.DatabaseDTOs.FoodDTO;
import Domain.DatabaseDTOs.FoodPartyFoodDTO;
import Domain.DatabaseDTOs.RestaurantDTO;
import Domain.Entities.Food;
import Domain.Entities.FoodPartyFood;
import Domain.Entities.Restaurant;
import ObjectMappers.Food.FoodMapper;
import ObjectMappers.FoodPartyFood.FoodPartyFoodMapper;
import ObjectMappers.Restaurant.RestaurantMapper;

import Utilities.DataProvider;
import Utilities.GetRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

public class RestaurantsManager {
    private static final String RESTAURANTS_SERVER_URL = "http://138.197.181.131:8080/restaurants";
    private static RestaurantsManager instance;
    private final RestaurantMapper restaurantMapper;
    private final FoodMapper foodMapper;
    private final FoodPartyFoodMapper foodPartyFoodMapper;

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

    private ArrayList<Restaurant> fetchRestaurantsInfo() {
//        String responseString = GetRequest.sendGetRequest(RestaurantsManager.RESTAURANTS_SERVER_URL);
//        try {
//            return new ArrayList<>(Arrays.asList(new ObjectMapper().readValue(responseString, Restaurant[].class)));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        return DataProvider.getRestaurants();
    }

    public void initialize() {
        ArrayList<Restaurant> restaurants = fetchRestaurantsInfo();
        insertRestaurants(restaurants);
    }

    private ArrayList<Restaurant> convertRestaurantDTOsListToRestaurantsList(ArrayList<RestaurantDTO> restaurantDTOs) {
        ArrayList<Restaurant> restaurants = new ArrayList<>();
        for (RestaurantDTO restaurantDTO : restaurantDTOs) {
            Restaurant restaurant = restaurantDTO.getRestaurantForm();
            restaurant.setMenu(convertFoodDTOListToFoodList(foodMapper.findAll(restaurant.getId(), null, null)));
            restaurant.setFoodPartyMenu(convertFoodPartyFoodDTOListToFoodPartyFoodList(foodPartyFoodMapper.findAll(restaurant.getId(), null, null)));
            restaurants.add(restaurant);
        }
        return restaurants;
    }

    public ArrayList<Restaurant> getRestaurants(Integer pageSize, Integer pageNum) {
        if (pageSize != null && pageNum != null) {
            return convertRestaurantDTOsListToRestaurantsList(restaurantMapper.findAll( "",
                                                                                        (pageNum - 1) * pageSize,
                                                                                         pageSize));
        }
        else {
            return convertRestaurantDTOsListToRestaurantsList(restaurantMapper.findAll( "",null, null));
        }
    }

    public ArrayList<Restaurant> getFoodPartyRestaurants() {
        ArrayList<Restaurant> foodpartyRestaurants = new ArrayList<>();
        for(Restaurant restaurant : getRestaurants(null, null)) {
            if (restaurant.getFoodPartyMenu() != null && !restaurant.getFoodPartyMenu().isEmpty()) {
                foodpartyRestaurants.add(restaurant);
            }
        }
        return foodpartyRestaurants;
    }

    private void insertRestaurant(Restaurant restaurant) {
        restaurantMapper.insert(new RestaurantDTO(restaurant));
    }

    private void insertRestaurantMenu(Restaurant restaurant) {
        if (restaurant.getMenu() != null && !restaurant.getMenu().isEmpty()) {
            for (Food food : restaurant.getMenu()) {
                foodMapper.insert(new FoodDTO(food, restaurant));
            }
        }
    }

    private void insertRestaurantFoodPartyMenu(Restaurant restaurant) {
        if (restaurant.getFoodPartyMenu() != null && !restaurant.getFoodPartyMenu().isEmpty()) {
            for (FoodPartyFood foodPartyFood : restaurant.getFoodPartyMenu()) {
                foodPartyFoodMapper.insert(new FoodPartyFoodDTO(foodPartyFood, restaurant));
            }
        }
    }

    public void updateFoodPartyFood(FoodPartyFood foodPartyFood, Restaurant restaurant) {
        FoodPartyFoodDTO foodPartyFoodDTO = new FoodPartyFoodDTO(foodPartyFood, restaurant);
        foodPartyFoodMapper.update(foodPartyFoodDTO);
    }

    public void insertRestaurants(ArrayList<Restaurant> restaurants) {
        for (Restaurant restaurant : restaurants) {
            insertRestaurant(restaurant);
            insertRestaurantMenu(restaurant);
            insertRestaurantFoodPartyMenu(restaurant);
        }
    }

    private ArrayList<Food> convertFoodDTOListToFoodList(ArrayList<FoodDTO> foodDTOs) {
        if (foodDTOs != null) {
            ArrayList<Food> foods = new ArrayList<>();
            for (FoodDTO foodDTO : foodDTOs) {
                foods.add(foodDTO.getFoodForm());
            }
            return foods;
        }
        else {
            return null;
        }
    }

    public ArrayList<Restaurant> search(String foodName, String restaurantName, int pageSize, int pageNum) {
        return convertRestaurantDTOsListToRestaurantsList(restaurantMapper.findByNameAndMenu(foodName, restaurantName,
                                                                                   (pageNum - 1) * pageSize, pageSize));
    }

    private ArrayList<FoodPartyFood> convertFoodPartyFoodDTOListToFoodPartyFoodList(ArrayList<FoodPartyFoodDTO> foodPartyFoodDTOs) {
        if (foodPartyFoodDTOs != null) {
            ArrayList<FoodPartyFood> foodPartyFoods = new ArrayList<>();
            for (FoodPartyFoodDTO foodPartyFoodDTO : foodPartyFoodDTOs) {
                foodPartyFoods.add(foodPartyFoodDTO.getFoodPartyFoodForm());
            }
            return foodPartyFoods;
        }
        else {
            return null;
        }
    }

    public Restaurant getRestaurantById(String id) {
        RestaurantDTO restaurantDTO = restaurantMapper.find(id);
        if (restaurantDTO != null) {
            Restaurant restaurant = restaurantDTO.getRestaurantForm();
            restaurant.setMenu(convertFoodDTOListToFoodList(foodMapper.findAll(id, null, null)));
            restaurant.setFoodPartyMenu(convertFoodPartyFoodDTOListToFoodPartyFoodList(foodPartyFoodMapper.findAll(id, null, null)));
            return restaurant;
        }
        else {
            return null;
        }
    }

    public Food getFoodById(String id) {
        FoodDTO foodDTO = foodMapper.find(id);
        Food food;
        if(foodDTO == null) {
            FoodPartyFoodDTO foodPartyFoodDTO = foodPartyFoodMapper.find(id);
            food = foodPartyFoodDTO.getFoodPartyFoodForm();
        }
        else {
            food = foodDTO.getFoodForm();
        }
        return food;
    }
}
