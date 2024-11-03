package Domain.Managers;

import Domain.DatabaseDTOs.FoodDTO;
import Domain.DatabaseDTOs.FoodPartyFoodDTO;
import Domain.DatabaseDTOs.RestaurantDTO;
import Domain.Entities.Food;
import Domain.Entities.FoodPartyFood;
import Domain.Entities.Restaurant;
import ObjectMappers.FoodMapper;
import ObjectMappers.FoodPartyFoodMapper;
import ObjectMappers.RestaurantMapper;
import Utilities.DataProvider;

import java.util.ArrayList;

public class RestaurantsManager {
    private static RestaurantsManager instance;

    private RestaurantsManager() {
    }

    public static RestaurantsManager getInstance() {
        if (instance == null) {
            instance = new RestaurantsManager();
        }
        return instance;
    }

    private ArrayList<Restaurant> fetchRestaurantsInfo() {
        //        String responseBody = GetRequest.sendGetRequest(Configs.RESTAURANTS_INFO_URL);
        //        try {
        //            return new ArrayList<>(Arrays.asList(new
        // ObjectMapper().readValue(responseBody, Restaurant[].class)));
        //        } catch (IOException e) {
        //            e.printStackTrace();
        //        }
        return DataProvider.getRestaurants();
    }

    public void initialize() {
        ArrayList<Restaurant> restaurants = fetchRestaurantsInfo();
        insertRestaurants(restaurants);
    }

    private ArrayList<Restaurant> convertRestaurantDTOsListToRestaurantsList(
            ArrayList<RestaurantDTO> restaurantDTOs) {
        ArrayList<Restaurant> restaurants = new ArrayList<>();
        for (RestaurantDTO restaurantDTO : restaurantDTOs) {
            Restaurant restaurant = restaurantDTO.getRestaurantForm();
            restaurant.setMenu(
                    convertFoodDTOListToFoodList(
                            FoodMapper.getInstance().findAll(restaurant.getId(), null, null)));
            restaurant.setFoodPartyMenu(
                    convertFoodPartyFoodDTOListToFoodPartyFoodList(
                            FoodPartyFoodMapper.getInstance()
                                    .findAll(restaurant.getId(), null, null)));
            restaurants.add(restaurant);
        }
        return restaurants;
    }

    public ArrayList<Restaurant> getRestaurants(Integer pageSize, Integer pageNum) {
        return convertRestaurantDTOsListToRestaurantsList(
                RestaurantMapper.getInstance().findAll("", (pageNum - 1) * pageSize, pageSize));
    }

    private ArrayList<Restaurant> getAllRestaurants() {
        return convertRestaurantDTOsListToRestaurantsList(
                RestaurantMapper.getInstance().findAll("", null, null));
    }

    public ArrayList<Restaurant> getFoodPartyRestaurants() {
        ArrayList<Restaurant> foodPartyRestaurants = new ArrayList<>();
        for (Restaurant restaurant : getAllRestaurants()) {
            if (!restaurant.getFoodPartyMenu().isEmpty()) {
                foodPartyRestaurants.add(restaurant);
            }
        }
        return foodPartyRestaurants;
    }

    private void insertRestaurant(Restaurant restaurant) {
        RestaurantMapper.getInstance().insert(new RestaurantDTO(restaurant));
    }

    private void insertRestaurantMenu(Restaurant restaurant) {
        if (!restaurant.getMenu().isEmpty()) {
            for (Food food : restaurant.getMenu()) {
                FoodMapper.getInstance().insert(new FoodDTO(food, restaurant));
            }
        }
    }

    private void insertRestaurantFoodPartyMenu(Restaurant restaurant) {
        if (!restaurant.getFoodPartyMenu().isEmpty()) {
            for (FoodPartyFood foodPartyFood : restaurant.getFoodPartyMenu()) {
                FoodPartyFoodMapper.getInstance()
                        .insert(new FoodPartyFoodDTO(foodPartyFood, restaurant));
            }
        }
    }

    public void updateFoodPartyFood(FoodPartyFood foodPartyFood, Restaurant restaurant) {
        FoodPartyFoodDTO foodPartyFoodDTO = new FoodPartyFoodDTO(foodPartyFood, restaurant);
        FoodPartyFoodMapper.getInstance().update(foodPartyFoodDTO);
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
        } else {
            return null;
        }
    }

    public ArrayList<Restaurant> search(
            String foodName, String restaurantName, int pageSize, int pageNum) {
        return convertRestaurantDTOsListToRestaurantsList(
                RestaurantMapper.getInstance()
                        .findByNameAndMenu(
                                foodName, restaurantName, (pageNum - 1) * pageSize, pageSize));
    }

    private ArrayList<FoodPartyFood> convertFoodPartyFoodDTOListToFoodPartyFoodList(
            ArrayList<FoodPartyFoodDTO> foodPartyFoodDTOs) {
        if (foodPartyFoodDTOs != null) {
            ArrayList<FoodPartyFood> foodPartyFoods = new ArrayList<>();
            for (FoodPartyFoodDTO foodPartyFoodDTO : foodPartyFoodDTOs) {
                foodPartyFoods.add(foodPartyFoodDTO.getFoodPartyFoodForm());
            }
            return foodPartyFoods;
        } else {
            return null;
        }
    }

    public Restaurant getRestaurantById(String id) {
        RestaurantDTO restaurantDTO = RestaurantMapper.getInstance().find(id);
        if (restaurantDTO != null) {
            Restaurant restaurant = restaurantDTO.getRestaurantForm();
            restaurant.setMenu(
                    convertFoodDTOListToFoodList(FoodMapper.getInstance().findAll(id, null, null)));
            restaurant.setFoodPartyMenu(
                    convertFoodPartyFoodDTOListToFoodPartyFoodList(
                            FoodPartyFoodMapper.getInstance().findAll(id, null, null)));
            return restaurant;
        } else {
            return null;
        }
    }

    public Food getFoodById(String id) {
        FoodDTO foodDTO = FoodMapper.getInstance().find(id);
        Food food;
        if (foodDTO == null) {
            FoodPartyFoodDTO foodPartyFoodDTO = FoodPartyFoodMapper.getInstance().find(id);
            food = foodPartyFoodDTO.getFoodPartyFoodForm();
        } else {
            food = foodDTO.getFoodForm();
        }
        return food;
    }
}
