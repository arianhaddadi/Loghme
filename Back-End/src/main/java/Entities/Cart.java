package Entities;

import java.util.ArrayList;

public class Cart {
    private ArrayList<CartItem> cartItems;
    private Restaurant restaurant;

    public Cart() {
        cartItems = new ArrayList<>();
    }


    public Boolean isEmpty() {
        return cartItems.size() == 0;
    }

    public String getRestaurantId() {
        if(cartItems.size() != 0)
            return restaurant.getId();
        else
            return "";
    }

    public void addCartItem(Food food, Restaurant restaurant, int quantity) {
        this.restaurant = restaurant;
        cartItems.add(new CartItem(food, quantity));
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
