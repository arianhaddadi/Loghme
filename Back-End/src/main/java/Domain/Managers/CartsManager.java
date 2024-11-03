package Domain.Managers;

import Domain.DatabaseDTOs.CartDTO;
import Domain.DatabaseDTOs.CartItemDTO;
import Domain.Entities.*;
import ObjectMappers.CartItemMapper;
import ObjectMappers.CartMapper;
import ObjectMappers.RestaurantMapper;
import Utilities.Response;

import java.util.ArrayList;

public class CartsManager {
    private static CartsManager instance;

    private CartsManager() {
    }

    public static CartsManager getInstance() {
        if (instance == null) {
            instance = new CartsManager();
        }
        return instance;
    }

    public Cart getCart(String userEmail) {
        Cart cart = new Cart();
        CartDTO cartDTO = CartMapper.getInstance().find(userEmail);
        Restaurant restaurant = null;
        if (!cartDTO.getRestaurantId().isEmpty()) {
            restaurant =
                    RestaurantMapper.getInstance()
                            .find(cartDTO.getRestaurantId())
                            .getRestaurantForm();
        }
        cart.setRestaurant(restaurant);
        ArrayList<CartItemDTO> cartItemDTOs =
                CartItemMapper.getInstance().findAll(cartDTO.getUserId(), null, null);
        for (CartItemDTO cartItemDTO : cartItemDTOs) {
            Food food =
                    RestaurantsManager.getInstance()
                            .getFoodById(
                                    cartItemDTO.getFoodName()
                                            + ","
                                            + cartItemDTO.getRestaurantId());
            cart.addItem(new CartItem(food, cartItemDTO.getQuantity()));
        }
        return cart;
    }

    public Response<Void> addToCart(
            String userEmail,
            String restaurantId,
            String foodName,
            int quantity,
            boolean isFoodPartyFood) {
        Restaurant restaurant = RestaurantsManager.getInstance().getRestaurantById(restaurantId);
        if (restaurant == null) {
            return new Response<>("Restaurant doesn't exist!", false);
        } else {
            Food food = restaurant.getFoodByName(isFoodPartyFood, foodName);
            if (food == null) {
                return new Response<>("Food doesn't exist!", false);
            }

            Cart cart = getCart(userEmail);
            if (cart.isEmpty() || cart.getRestaurantId().equals(restaurantId)) {
                if (isFoodPartyFood) {
                    if (((FoodPartyFood) food).getCount() < quantity) {
                        return new Response<>(
                                "There isn't enough number of this food for adding to cart!",
                                false);
                    } else {
                        ((FoodPartyFood) food).decreaseCount(quantity);
                        RestaurantsManager.getInstance()
                                .updateFoodPartyFood(((FoodPartyFood) food), restaurant);
                    }
                }
                addToCartInDatabase(userEmail, food.getName(), restaurant.getId(), quantity);
                return new Response<>(
                        "Your desired food was successfully added to your cart!", true);
            } else {
                return new Response<>(
                        "You have other food from other restaurants in your cart!", false);
            }
        }
    }

    public Response<Void> deleteFromCart(
            String userEmail, String restaurantId, String foodName, boolean isFoodPartyFood) {
        Restaurant restaurant = RestaurantsManager.getInstance().getRestaurantById(restaurantId);
        if (restaurant == null) {
            return new Response<>("Restaurant doesn't exist!", false);
        } else {
            Food food = restaurant.getFoodByName(isFoodPartyFood, foodName);
            if (food == null) {
                return new Response<>("Food doesn't exist!", false);
            }
            if (isFoodPartyFood) {
                ((FoodPartyFood) food).increaseCount(1);
                RestaurantsManager.getInstance()
                        .updateFoodPartyFood(((FoodPartyFood) food), restaurant);
            }
            CartsManager.getInstance().decreaseItemQuantity(userEmail, foodName, restaurantId);
            return new Response<>("Item was successfully removed!", true);
        }
    }

    public Response<Void> finalizeOrder(String userEmail) {
        User user = UsersManager.getInstance().findUserByEmail(userEmail);
        if (user.getCart().isEmpty()) {
            return new Response<>("Your cart is empty!", false);
        } else if (!user.hasEnoughCredit()) {
            return new Response<>("Your credit is not enough!", false);
        } else {
            UsersManager.getInstance().addCredit(userEmail, user.getCart().getSum() * (-1));
            Order order =
                    new Order(
                            user.getCart(),
                            Integer.toString(OrdersManager.getInstance().getNumOfOrders() + 1),
                            userEmail);
            OrdersManager.getInstance()
                    .addOrder(order.getId(), order.getStatus().name(), userEmail, user.getCart());
            order.deliver();
            emptyCart(userEmail);
            return new Response<>("Order was finalized!", true);
        }
    }

    public void addToCartInDatabase(
            String userEmail, String foodName, String restaurantId, int quantity) {
        String itemId = userEmail + "," + foodName + "," + restaurantId;
        CartItemDTO cartItem = CartItemMapper.getInstance().find(itemId);
        if (cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            CartItemMapper.getInstance().update(cartItem);
        } else {
            CartItemDTO cartItemDTO = new CartItemDTO(quantity, userEmail, foodName, restaurantId);
            CartItemMapper.getInstance().insert(cartItemDTO);
        }
        CartMapper.getInstance().update(new CartDTO(userEmail, restaurantId));
    }

    public void decreaseItemQuantity(String userEmail, String foodName, String restaurantId) {
        String itemId = userEmail + "," + foodName + "," + restaurantId;
        CartItemDTO cartItem = CartItemMapper.getInstance().find(itemId);
        if (cartItem.getQuantity() == 1) {
            CartItemMapper.getInstance().delete(itemId);
            ArrayList<CartItemDTO> cartItemDTOs =
                    CartItemMapper.getInstance().findAll(userEmail, null, null);
            if (cartItemDTOs.isEmpty()) {
                CartMapper.getInstance().update(new CartDTO(userEmail, ""));
            }
        } else {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
            CartItemMapper.getInstance().update(cartItem);
        }
    }

    public void emptyCart(String userEmail) {
        CartMapper.getInstance().delete(userEmail);
        CartMapper.getInstance().insert(new CartDTO(userEmail, ""));
    }
}
