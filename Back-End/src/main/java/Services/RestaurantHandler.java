package Services;

import Domain.Restaurant.RestaurantsManager;
import Entities.Restaurant;

import Services.Utilities.ArrayListResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class RestaurantHandler {

    @RequestMapping(value = "/restaurants", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ArrayListResponse<Restaurant> getAllRestaurants(
                                        @RequestParam(value = "pageSize") int pageSize,
                                        @RequestParam(value = "pageNum") int pageNum) {

        return new ArrayListResponse<Restaurant>(RestaurantsManager.getInstance().getRestaurants(pageSize, pageNum));
    }

    @RequestMapping(value = "/restaurants/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Restaurant getRestaurant(@PathVariable(value = "id") String id) {
        return RestaurantsManager.getInstance().getRestaurantById(id);
    }
}
