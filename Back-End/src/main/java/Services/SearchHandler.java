package Services;

import Domain.Restaurant.RestaurantsManager;
import Entities.Restaurant;

import Services.Utilities.ArrayListResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class SearchHandler {

    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ArrayListResponse<Restaurant> searchRestaurants(@RequestParam(value = "foodName") String foodName,
                                                           @RequestParam(value = "restaurantName") String restaurantName,
                                                           @RequestParam(value = "pageSize") int pageSize,
                                                           @RequestParam(value = "pageNum") int pageNum) {

        return new ArrayListResponse<Restaurant>(RestaurantsManager.getInstance().search(foodName, restaurantName,
                                                                                         pageSize, pageNum));
    }

}
