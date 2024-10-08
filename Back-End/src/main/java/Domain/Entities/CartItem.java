package Domain.Entities;

public class CartItem {
    private final Food food;
    private int quantity;

    public CartItem(Food food, int quantity) {
        this.food = food;
        this.quantity = quantity;
    }

    public Food getFood() {
        return food;
    }

    public int getQuantity() {
        return quantity;
    }

    public void increaseQuantity(int number) {
        quantity += number;
    }
}
