package Domain.Entities;

public class User {
    private final String name;
    private final String familyName;
    private final String email;
    private final String password;
    private final String phoneNumber;
    private final float credit;
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

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public String getPassword() {
        return password;
    }
}
