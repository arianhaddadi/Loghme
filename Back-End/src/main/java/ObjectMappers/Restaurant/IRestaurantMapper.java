package ObjectMappers.Restaurant;

import Domain.DatabaseDTOs.RestaurantDTO;
import ObjectMappers.IMapper;

import java.util.ArrayList;

public interface IRestaurantMapper extends IMapper<RestaurantDTO, String> {
    ArrayList<RestaurantDTO> findByNameAndMenu(String foodName, String restaurantName, Integer limitStart, Integer limitSize);
}
