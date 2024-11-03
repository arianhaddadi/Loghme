package Services;

import Domain.Entities.Order;
import Domain.Managers.OrdersManager;
import Utilities.Configs;
import Utilities.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
public class OrderService {

    @RequestMapping(
            value = "/orders",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ArrayList<Order>> getAllOrders(
            @RequestAttribute(value = Configs.USER_ID_ATTRIBUTE) String userEmail) {
        return new Response<>(OrdersManager.getInstance().getAllOrders(userEmail), true);
    }
}
