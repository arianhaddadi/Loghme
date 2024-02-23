package Services;

import Domain.Managers.RestaurantsManager;
import Domain.Entities.*;
import PeriodicJobs.FoodPartyUpdater;
import Services.DTOs.FoodPartyResponseDTO;
import Utilities.Response;
import Utilities.CollectDataAndSchedule;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;


@RestController
public class FoodPartyService {

    @RequestMapping(value = "/foodparties", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<FoodPartyResponseDTO> getFoodPartyRestaurants() {
        FoodPartyUpdater foodPartyUpdater = CollectDataAndSchedule.getFoodPartyUpdater();
        ArrayList<Restaurant> foodPartyRestaurants = RestaurantsManager.getInstance().getFoodPartyRestaurants();
        FoodPartyResponseDTO foodPartyResponseDTO = new FoodPartyResponseDTO(foodPartyUpdater.getMinutes(), foodPartyUpdater.getSeconds(), foodPartyRestaurants);
        return new Response<>(foodPartyResponseDTO, true);
    }

}
