package Services;

import Domain.Managers.FoodPartyManager;
import Domain.Managers.RestaurantsManager;
import Domain.Entities.*;
import Services.DTOs.FoodPartyResponseDTO;
import Utilities.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

@RestController
public class FoodPartyService {

    @RequestMapping(
            value = "/foodparties",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<FoodPartyResponseDTO> getFoodPartyRestaurants() {
        ArrayList<Restaurant> foodPartyRestaurants =
                RestaurantsManager.getInstance().getFoodPartyRestaurants();
        FoodPartyResponseDTO foodPartyResponseDTO =
                new FoodPartyResponseDTO(
                        FoodPartyManager.getInstance().getRemainingMinutes(),
                        FoodPartyManager.getInstance().getRemainingSeconds(),
                        foodPartyRestaurants);
        return new Response<>(foodPartyResponseDTO, true);
    }
}
