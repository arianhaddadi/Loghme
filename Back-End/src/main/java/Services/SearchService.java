package Services;

import Domain.Managers.RestaurantsManager;
import Domain.Entities.Restaurant;
import Utilities.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class SearchService {

    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ArrayList<Restaurant>> searchRestaurants(@RequestParam(value = "foodName") String foodName,
                                                             @RequestParam(value = "restaurantName") String restaurantName,
                                                             @RequestParam(value = "pageSize") int pageSize,
                                                             @RequestParam(value = "pageNum") int pageNum) {

        return new Response<>(RestaurantsManager.getInstance().search(foodName, restaurantName, pageSize, pageNum), true);
    }

}
