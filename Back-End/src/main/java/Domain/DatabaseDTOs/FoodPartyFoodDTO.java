package Domain.DatabaseDTOs;

import Domain.Entities.FoodPartyFood;
import Domain.Entities.Restaurant;

public class FoodPartyFoodDTO extends FoodDTO {
    private float oldPrice;
    private int count;

    public FoodPartyFoodDTO() {
    }

    public FoodPartyFoodDTO(FoodPartyFood foodPartyFood, Restaurant restaurant) {
        super(foodPartyFood, restaurant);
        this.oldPrice = foodPartyFood.getOldPrice();
        this.count = foodPartyFood.getCount();
    }

    public FoodPartyFood getFoodPartyFoodForm() {
        return new FoodPartyFood(name, description, image, price, popularity, count, oldPrice);
    }

    public float getOldPrice() {
        return oldPrice;
    }

    public void setOldPrice(float oldPrice) {
        this.oldPrice = oldPrice;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }
}
