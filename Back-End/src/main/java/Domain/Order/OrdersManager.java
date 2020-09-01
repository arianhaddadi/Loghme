package Domain.Order;

import Domain.Restaurant.RestaurantsManager;
import Domain.User.UsersManager;
import Entities.*;
import Mappers.Order.OrderMapper;
import Mappers.OrderItem.OrderItemMapper;

import java.util.ArrayList;

public class OrdersManager {
    private static OrdersManager instance;

    public static OrdersManager getInstance() {
        if (instance == null) {
            instance = new OrdersManager();
        }
        return instance;
    }

    private OrdersManager() {}

    public void addOrder(String id, String status, String userId, Cart cart) {
        OrderMapper.getInstance().insert(new OrderDAO(id, status, userId, 0, 0));
        if(cart.getCartItems() != null) {
            for(CartItem cartItem : cart.getCartItems()) {
                OrderItemMapper.getInstance().insert(new OrderItemDAO(cartItem.getQuantity(), id, cartItem.getFood().getName(), cart.getRestaurantId()));
            }
        }
    }

    public int getCount() {
        return OrderMapper.getInstance().getCount();
    }

    private Order convertOrderDAOToOrder(OrderDAO orderDAO, Cart cart) {
        Order order = new Order(cart, orderDAO.getId(), orderDAO.getUserId());
        order.setStatus(Order.Status.valueOf(orderDAO.getStatus()));
        order.setDeliveryStartTime(orderDAO.getDeliveryStartTime());
        order.setDeliveryTime(orderDAO.getDeliveryTime());
        return order;
    }

    public ArrayList<Order> getAllOrders(String userEmail) {
        ArrayList<OrderDAO> orderDAOS = OrderMapper.getInstance().findAll(userEmail, null, null);
        ArrayList<Order> orders = new ArrayList<>();
        for(OrderDAO orderDAO : orderDAOS) {
            Cart cart = getOrderCart(orderDAO.getId());
            orders.add(convertOrderDAOToOrder(orderDAO, cart));
        }
        return orders;
    }

    public Cart getOrderCart(String orderId) {
        Cart cart = new Cart();
        ArrayList<OrderItemDAO> orderItemDAOS = OrderItemMapper.getInstance().findAll(orderId, null, null);
        if(orderItemDAOS.size() != 0) {
            cart.setRestaurant(RestaurantsManager.getInstance().getRestaurantById(orderItemDAOS.get(0).getRestaurantId()));
        }
        for(OrderItemDAO orderItemDAO : orderItemDAOS) {
            Food food = RestaurantsManager.getInstance().getFoodById(orderItemDAO.getFoodName() + "," + orderItemDAO.getRestaurantId());
            cart.addItem(orderItemDAO.getCartItemForm(food));
        }
        return cart;
    }

    public Order getOrderById(String id) {
        OrderDAO orderDAO = OrderMapper.getInstance().find(id);
        Cart cart = getOrderCart(id);
        return convertOrderDAOToOrder(orderDAO, cart);
    }

    public void updateOrderStatus(Order order) {
        OrderMapper.getInstance().update(new OrderDAO(order.getId(), order.getStatus().name(), order.getUserId(), order.getDeliveryStartTime(), order.getDeliveryTime()));
    }
}
