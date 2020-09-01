package Services;

import Domain.Restaurant.RestaurantsManager;
import Entities.*;
import PeriodicJobs.FoodPartyUpdater;
import Services.Utilities.ArrayListResponse;
import Services.Utilities.ResponseMessage;
import Utilities.CollectDataAndSchedule;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;







@RestController
public class FoodPartyHandler {

    @RequestMapping(value = "/foodparties", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ArrayListResponse<Restaurant> getFoodPartyRestaurants() {
        FoodPartyUpdater foodPartyUpdater = CollectDataAndSchedule.getFoodPartyUpdater();
        ArrayList<Restaurant> foodpartyRestaurants = RestaurantsManager.getInstance().getFoodPartyRestaurants();
        return new ArrayListResponse<Restaurant>(foodpartyRestaurants, new ResponseMessage(foodPartyUpdater.getMinutes(), foodPartyUpdater.getSeconds(), true));
    }

}
