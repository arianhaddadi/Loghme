package Services;

import Domain.Entities.Restaurant;
import Domain.Managers.RestaurantsManager;

import Utilities.Response;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class RestaurantService {

    @RequestMapping(
            value = "/restaurants",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ArrayList<Restaurant>> getAllRestaurants(
            @RequestParam(value = "pageSize") int pageSize,
            @RequestParam(value = "pageNum") int pageNum) {
        return new Response<>(
                RestaurantsManager.getInstance().getRestaurants(pageSize, pageNum), true);
    }

    @RequestMapping(
            value = "/restaurants/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Restaurant getRestaurant(@PathVariable(value = "id") String id) {
        return RestaurantsManager.getInstance().getRestaurantById(id);
    }
}
