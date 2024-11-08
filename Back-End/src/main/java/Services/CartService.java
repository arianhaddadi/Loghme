package Services;

import Domain.Entities.Cart;
import Domain.Managers.CartsManager;
import Utilities.Configs;
import Utilities.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class CartService {

    @RequestMapping(
            value = "/carts",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Cart getCart(@RequestAttribute(value = Configs.USER_ID_ATTRIBUTE) String userEmail) {
        return CartsManager.getInstance().getCart(userEmail);
    }

    @RequestMapping(
            value = "/carts",
            method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Void> updateCart(
            @RequestAttribute(value = Configs.USER_ID_ATTRIBUTE) String userEmail,
            @RequestParam(value = "restaurantId") String restaurantId,
            @RequestParam(value = "foodName") String foodName,
            @RequestParam(value = "quantity") int quantity,
            @RequestParam(value = "isFoodPartyFood") boolean isFoodPartyFood) {

        return CartsManager.getInstance()
                .addToCart(userEmail, restaurantId, foodName, quantity, isFoodPartyFood);
    }

    @RequestMapping(
            value = "/carts",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Void> finalizeCart(
            @RequestAttribute(value = Configs.USER_ID_ATTRIBUTE) String userEmail) {
        return CartsManager.getInstance().finalizeOrder(userEmail);
    }

    @RequestMapping(
            value = "/carts",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Void> deleteItem(
            @RequestAttribute(value = Configs.USER_ID_ATTRIBUTE) String userEmail,
            @RequestParam(value = "restaurantId") String restaurantId,
            @RequestParam(value = "foodName") String foodName,
            @RequestParam(value = "isFoodPartyFood") boolean isFoodPartyFood) {

        return CartsManager.getInstance()
                .deleteFromCart(userEmail, restaurantId, foodName, isFoodPartyFood);
    }
}
