package Domain.DatabaseDTOs;

import Domain.Entities.CartItem;
import Domain.Entities.Food;

public class OrderItemDTO {
    private int quantity;
    private String orderId;
    private String foodName;
    private String restaurantId;

    public OrderItemDTO() {
    }

    public OrderItemDTO(int quantity, String orderId, String foodName, String restaurantId) {
        this.quantity = quantity;
        this.orderId = orderId;
        this.foodName = foodName;
        this.restaurantId = restaurantId;
    }

    public int getQuantity() {
        return quantity;
    }

    public CartItem getCartItemForm(Food food) {
        return new CartItem(food, quantity);
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
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
}
