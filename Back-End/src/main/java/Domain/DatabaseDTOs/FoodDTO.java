package Domain.DatabaseDTOs;

import Domain.Entities.Food;
import Domain.Entities.Restaurant;

public class FoodDTO {
    protected String name;
    protected String description;
    protected String image;
    protected String restaurantId;
    protected float price;
    protected float popularity;

    public FoodDTO() {}

    public FoodDTO(Food food, Restaurant restaurant) {
        this.name = food.getName();
        this.description = food.getDescription();
        this.image = food.getImage();
        this.restaurantId = restaurant.getId();
        this.price = food.getPrice();
        this.popularity = food.getPopularity();
    }

    public Food getFoodForm() {
        return new Food(name, description, image, price, popularity);
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getImage() {
        return image;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public float getPrice() {
        return price;
    }

    public float getPopularity() {
        return popularity;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public void setPopularity(float popularity) {
        this.popularity = popularity;
    }

}
