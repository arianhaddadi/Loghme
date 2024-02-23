package Services;

import Domain.Managers.OrdersManager;
import Domain.Entities.Order;
import Utilities.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
public class OrderService {

    @RequestMapping(value = "/orders", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<ArrayList<Order>> getAllOrders(@RequestAttribute(value = "userEmail") String userEmail) {
        return new Response<>(OrdersManager.getInstance().getAllOrders(userEmail), true);
    }

    @RequestMapping(value = "/orders/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Order getOrder(@RequestAttribute(value = "userEmail") String userEmail,
                          @PathVariable(value = "id") String id) {
        return OrdersManager.getInstance().getOrderById(id);
    }

}
