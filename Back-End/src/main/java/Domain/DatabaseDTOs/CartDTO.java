package Domain.DatabaseDTOs;

public class CartDTO {
    private String userId;
    private String restaurantId;

    public CartDTO() {}

    public CartDTO(String userId, String restaurantId) {
        this.userId = userId;
        this.restaurantId = restaurantId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }
}
