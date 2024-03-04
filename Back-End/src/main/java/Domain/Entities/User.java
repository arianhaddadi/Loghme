package Domain.Entities;

import Domain.Managers.CartsManager;
import Domain.Managers.OrdersManager;
import Domain.Managers.UsersManager;

import java.util.ArrayList;

public class User {
    private String name, familyName, email, password, phoneNumber;
    private float credit;
    private Cart cart;
    public User(String name, String familyName, String email, String password, String phoneNumber, float credit) {
        this.name = name;
        this.familyName = familyName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.credit = credit;
        this.cart = new Cart();
    }

    public boolean hasEnoughCredit() {
        return credit >= cart.getSum();
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

    public void setCart(Cart cart) {this.cart = cart; }

    public String getPassword() {
        return password;
    }
}
