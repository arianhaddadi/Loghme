package Domain.Cart;

import Domain.Restaurant.RestaurantsManager;
import Domain.User.UsersManager;
import Entities.*;
import Mappers.Cart.CartMapper;
import Mappers.CartItem.CartItemMapper;
import Mappers.Restaurant.RestaurantMapper;
import Services.Utilities.ResponseMessage;

import java.util.ArrayList;

public class CartsManager {
    private static CartsManager instance;

    public static CartsManager getInstance() {
        if (instance == null) {
            instance = new CartsManager();
        }
        return instance;
    }

    private CartsManager() {}

    public Cart getCart(String userEmail) {
        Cart cart = new Cart();
        CartDAO cartDAO = CartMapper.getInstance().find(userEmail);
        Restaurant restaurant = null;
        if(!cartDAO.getRestaurantId().equals("")) {
            restaurant = RestaurantMapper.getInstance().find(cartDAO.getRestaurantId()).getRestaurantForm();
        }
        cart.setRestaurant(restaurant);
        ArrayList<CartItemDAO> cartItemDAOS = CartItemMapper.getInstance().findAll(cartDAO.getUserId(), null, null);
        for(CartItemDAO cartItemDAO : cartItemDAOS) {
            Food food = RestaurantsManager.getInstance().getFoodById(cartItemDAO.getFoodName() + "," + cartItemDAO.getRestaurantId());
            cart.addCartItem(food, restaurant, cartItemDAO.getQuantity());
        }
        return cart;
    }

    public ResponseMessage addToCart(String userEmail, String restaurantId, String foodName, int quantity, boolean isFoodPartyFood) {
        Restaurant restaurant = RestaurantsManager.getInstance().getRestaurantById(restaurantId);
        if(restaurant == null) {
            return new ResponseMessage("Restaurant doesn't exist!", false);
        }
        else {
            Food food = restaurant.getFoodOrFoodPartyByName(isFoodPartyFood, foodName);
            Cart cart = getCart(userEmail);
            if(food == null) {
                return new ResponseMessage("Food doesn't exist!", false);
            }
            else if(cart.isEmpty() || cart.getRestaurantId().equals(restaurantId)) {
                if(isFoodPartyFood) {
                    if (((FoodPartyFood)food).getCount() < quantity) {
                        return new ResponseMessage("There isn't enough number of this food for adding to cart!", false);
                    }
                    else {
                        ((FoodPartyFood)food).decreaseCount(quantity);
                        RestaurantsManager.getInstance().updateFoodPartyFood(((FoodPartyFood)food), restaurant);
                    }
                }
                addToCartInDatabase(userEmail, food.getName(), restaurant.getId(), quantity);
                return new ResponseMessage("Your desired food was successfully added to your cart!", true);
            }
            else {
                return new ResponseMessage("You have other food from other restaurants in your cart!", false);
            }
        }
    }

    public ResponseMessage deleteFromCart(String userEmail, String restaurantId, String foodName, boolean isFoodPartyFood) {
        Restaurant restaurant = RestaurantsManager.getInstance().getRestaurantById(restaurantId);
        if(restaurant == null) {
            return new ResponseMessage("Restaurant doesn't exist!", false);
        }
        else {
            if(isFoodPartyFood) {
                FoodPartyFood food = restaurant.getFoodPartyFoodByName(foodName);
                if(food == null) {
                    return new ResponseMessage("Food doesn't exist!", false);
                }
                food.increaseCount(1);
                RestaurantsManager.getInstance().updateFoodPartyFood(food, restaurant);
            }
            else {
                Food food = restaurant.getFoodByName(foodName);
                if(food == null) {
                    return new ResponseMessage("Food doesn't exist!", false);
                }
            }
            CartsManager.getInstance().decreaseItemQuantity(userEmail, foodName, restaurantId);
            return new ResponseMessage("Item was successfully removed!", true);
        }
    }

    public ResponseMessage finalizeOrder(String userEmail) {
        User user = UsersManager.getInstance().findUserByEmail(userEmail);
        if(user.getCart().isEmpty()) {
            return new ResponseMessage("Your cart is empty!", false);
        }
        else if(!user.hasEnoughCredit()) {
            return new ResponseMessage("Your credit is not enough!", false);
        }
        else {
            user.finalizeOrder();
            return new ResponseMessage("Order was finalized!", true);
        }
    }

    public void addToCartInDatabase(String userEmail, String foodName, String restaurantId, int quantity) {
        String itemId = userEmail + "," + foodName + "," + restaurantId;
        CartItemDAO cartItem = CartItemMapper.getInstance().find(itemId);
        if(cartItem != null) {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            CartItemMapper.getInstance().update(cartItem);
        }
        else {
            CartItemDAO cartItemDAO = new CartItemDAO(quantity, userEmail, foodName, restaurantId);
            CartItemMapper.getInstance().insert(cartItemDAO);
        }
        CartMapper.getInstance().update(new CartDAO(userEmail, restaurantId));
    }

    public void decreaseItemQuantity(String userEmail, String foodName, String restaurantId) {
        String itemId = userEmail + "," + foodName + "," + restaurantId;
        CartItemDAO cartItem = CartItemMapper.getInstance().find(itemId);
        if(cartItem.getQuantity() == 1) {
            CartItemMapper.getInstance().delete(itemId);
            ArrayList<CartItemDAO> cartItemDAOS = CartItemMapper.getInstance().findAll(userEmail, null, null);
            if(cartItemDAOS.size() == 0) {
                CartMapper.getInstance().update(new CartDAO(userEmail, ""));
            }
        }
        else {
            cartItem.setQuantity(cartItem.getQuantity() - 1);
            CartItemMapper.getInstance().update(cartItem);
        }
    }

    public void emptyCart(String userEmail) {
        CartMapper.getInstance().delete(userEmail);
        CartMapper.getInstance().insert(new CartDAO(userEmail, ""));
    }
}
