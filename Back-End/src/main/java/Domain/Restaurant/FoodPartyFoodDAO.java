package Domain.Restaurant;

import Entities.FoodPartyFood;
import Entities.Restaurant;

public class FoodPartyFoodDAO extends FoodDAO {
    private float oldPrice;
    private int count;

    public FoodPartyFoodDAO() {
        return;
    }

    public FoodPartyFoodDAO(FoodPartyFood foodPartyFood, Restaurant restaurant) {
        super(foodPartyFood, restaurant);
        this.oldPrice = foodPartyFood.getOldPrice();
        this.count = foodPartyFood.getCount();
    }

    public FoodPartyFood getFoodPartyFoodForm() {
        FoodPartyFood foodPartyFood = new FoodPartyFood();
        foodPartyFood.setName(name);
        foodPartyFood.setDescription(description);
        foodPartyFood.setImage(image);
        foodPartyFood.setPrice(price);
        foodPartyFood.setOldPrice(oldPrice);
        foodPartyFood.setPopularity(popularity);
        foodPartyFood.setCount(count);
        return foodPartyFood;
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
