package Domain.Managers;

import Domain.DatabaseDTOs.OrderDTO;
import Domain.DatabaseDTOs.OrderItemDTO;
import Domain.Entities.Cart;
import Domain.Entities.CartItem;
import Domain.Entities.Food;
import Domain.Entities.Order;
import ObjectMappers.OrderItemMapper;
import ObjectMappers.OrderMapper;

import java.util.ArrayList;

public class OrdersManager {
    private static OrdersManager instance;

    private OrdersManager() {
    }

    public static OrdersManager getInstance() {
        if (instance == null) {
            instance = new OrdersManager();
        }
        return instance;
    }

    public void addOrder(String id, String status, String userId, Cart cart) {
        OrderMapper.getInstance().insert(new OrderDTO(id, status, userId));
        if (cart.getCartItems() != null) {
            for (CartItem cartItem : cart.getCartItems()) {
                OrderItemMapper.getInstance()
                        .insert(
                                new OrderItemDTO(
                                        cartItem.getQuantity(),
                                        id,
                                        cartItem.getFood().getName(),
                                        cart.getRestaurantId()));
            }
        }
    }

    public int getNumOfOrders() {
        return OrderMapper.getInstance().getNumOfOrders();
    }

    private Order convertOrderDTOToOrder(OrderDTO orderDTO, Cart cart) {
        Order order = new Order(cart, orderDTO.getId(), orderDTO.getUserId());
        order.setStatus(Order.Status.valueOf(orderDTO.getStatus()));
        return order;
    }

    public ArrayList<Order> getAllOrders(String userEmail) {
        ArrayList<OrderDTO> orderDTOs = OrderMapper.getInstance().findAll(userEmail, null, null);
        ArrayList<Order> orders = new ArrayList<>();
        for (OrderDTO orderDTO : orderDTOs) {
            Cart cart = getOrderCart(orderDTO.getId());
            orders.add(convertOrderDTOToOrder(orderDTO, cart));
        }
        return orders;
    }

    public Cart getOrderCart(String orderId) {
        Cart cart = new Cart();
        ArrayList<OrderItemDTO> orderItemDTOs =
                OrderItemMapper.getInstance().findAll(orderId, null, null);
        if (!orderItemDTOs.isEmpty()) {
            cart.setRestaurant(
                    RestaurantsManager.getInstance()
                            .getRestaurantById(orderItemDTOs.get(0).getRestaurantId()));
        }
        for (OrderItemDTO orderItemDTO : orderItemDTOs) {
            Food food =
                    RestaurantsManager.getInstance()
                            .getFoodById(
                                    orderItemDTO.getFoodName()
                                            + ","
                                            + orderItemDTO.getRestaurantId());
            cart.addItem(orderItemDTO.getCartItemForm(food));
        }
        return cart;
    }

    public Order getOrderById(String id) {
        OrderDTO orderDTO = OrderMapper.getInstance().find(id);
        Cart cart = getOrderCart(id);
        return convertOrderDTOToOrder(orderDTO, cart);
    }

    public void updateOrderStatus(Order order) {
        OrderMapper.getInstance()
                .update(new OrderDTO(order.getId(), order.getStatus().name(), order.getUserId()));
    }
}
