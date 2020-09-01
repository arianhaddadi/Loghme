package Services;

import Domain.Cart.CartsManager;
import Entities.*;
import Services.Utilities.ResponseMessage;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class CartHandler {

    @RequestMapping(value = "/carts", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Cart getCart(@RequestAttribute(value = "userEmail") String userEmail) {
        return CartsManager.getInstance().getCart(userEmail);
    }

    @RequestMapping(value = "/carts", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseMessage updateCart(
                            @RequestAttribute(value = "userEmail") String userEmail,
                            @RequestParam(value = "restaurantId") String restaurantId,
                            @RequestParam(value = "foodName") String foodName,
                            @RequestParam(value = "quantity") int quantity,
                            @RequestParam(value = "isFoodPartyFood") boolean isFoodPartyFood) {

        return CartsManager.getInstance().addToCart(userEmail, restaurantId, foodName, quantity, isFoodPartyFood);
    }

    @RequestMapping(value = "/carts", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseMessage finalizeCart(@RequestAttribute(value = "userEmail") String userEmail) {
        return CartsManager.getInstance().finalizeOrder(userEmail);
    }


    @RequestMapping(value = "/carts", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseMessage deleteItem(
                            @RequestAttribute(value = "userEmail") String userEmail,
                            @RequestParam(value = "restaurantId") String restaurantId,
                            @RequestParam(value = "foodName") String foodName,
                            @RequestParam(value = "isFoodPartyFood") boolean isFoodPartyFood) {

        return CartsManager.getInstance().deleteFromCart(userEmail, restaurantId, foodName, isFoodPartyFood);
    }
}
