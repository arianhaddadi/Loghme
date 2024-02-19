package Entities;

import Domain.Cart.CartsManager;
import Domain.Order.OrdersManager;
import Domain.User.UsersManager;

import java.util.ArrayList;

public class User {
    private String name, familyName, email, password, phoneNumber;
    private float credit;
    private Cart cart;
    private Location location;
    private ArrayList<Order> orders;

    public User(String name, String familyName, String email, String password, String phoneNumber, float credit) {
        this.name = name;
        this.familyName = familyName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.credit = credit;
        this.cart = new Cart();
        this.location = new Location(0, 0);
        this.orders = new ArrayList<>();
    }

    public boolean hasEnoughCredit() {
        return credit >= cart.getSum();
    }

    public void finalizeOrder() {
        UsersManager.getInstance().addCredit(email, cart.getSum() * (-1));
        Order order = new Order(cart, Integer.toString(OrdersManager.getInstance().getCount() + 1), email);
        OrdersManager.getInstance().addOrder(order.getId(), order.getStatus().name(), email, cart);
        order.run();
        CartsManager.getInstance().emptyCart(email);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFamilyName() {
        return familyName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public float getCredit() {
        return credit;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart_) {this.cart = cart_; }

    public String getPassword() {
        return password;
    }
}
