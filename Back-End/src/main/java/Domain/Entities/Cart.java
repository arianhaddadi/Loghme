package Domain.Entities;

import java.util.ArrayList;

public class Cart {
    private final ArrayList<CartItem> cartItems = new ArrayList<>();;
    private Restaurant restaurant;
    public Cart() {}
    public Boolean isEmpty() {
        return cartItems.isEmpty();
    }

    public String getRestaurantId() {
        if(!cartItems.isEmpty())
            return restaurant.getId();
        else
            return "";
    }

    public void addItem(CartItem cartItem) {
        cartItems.add(cartItem);
    }

    public float getSum() {
        float sum = 0;
        for (CartItem cartItem : cartItems) {
            sum += cartItem.getQuantity() * cartItem.getFood().getPrice();
        }
        return sum;
    }

    public Restaurant getRestaurant() {
        return restaurant;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    public ArrayList<CartItem> getCartItems() {
        return cartItems;
    }

}
