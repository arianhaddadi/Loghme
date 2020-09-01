package Services;

import Domain.Order.OrdersManager;
import Entities.Order;

import Services.Utilities.ArrayListResponse;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrderHandler {

    @RequestMapping(value = "/orders", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ArrayListResponse<Order> getAllOrders(@RequestAttribute(value = "userEmail") String userEmail) {
        return new ArrayListResponse<Order>(OrdersManager.getInstance().getAllOrders(userEmail));
    }

    @RequestMapping(value = "/orders/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Order getOrder(@RequestAttribute(value = "userEmail") String userEmail,
                          @PathVariable(value = "id") String id) {
        return OrdersManager.getInstance().getOrderById(id);
    }

}
