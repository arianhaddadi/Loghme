package Domain.Cart;

public class CartItemDAO {
    private int quantity;
    private String cartId;
    private String foodName;
    private String restaurantId;

    public CartItemDAO() {

    }

    public CartItemDAO(int quantity, String cartId, String foodName, String restaurantId) {
        this.quantity = quantity;
        this.cartId = cartId;
        this.foodName = foodName;
        this.restaurantId = restaurantId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getCartId() {
        return cartId;
    }

    public void setCartId(String cartId) {
        this.cartId = cartId;
    }
}
