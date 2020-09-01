package Mappers.Restaurant;

import Domain.Restaurant.RestaurantDAO;
import Mappers.IMapper;

import java.util.ArrayList;

public interface IRestaurantMapper extends IMapper<RestaurantDAO, String> {
    ArrayList<RestaurantDAO> findByNameAndMenu(String foodName, String restaurantName, Integer limitStart, Integer limitSize);
}
