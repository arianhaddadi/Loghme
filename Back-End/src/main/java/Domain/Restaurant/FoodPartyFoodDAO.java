package Domain.Restaurant;

import Entities.FoodPartyFood;
import Entities.Restaurant;

public class FoodPartyFoodDAO extends FoodDAO {
    private float oldPrice;
    private int count;

    public FoodPartyFoodDAO() {}

    public FoodPartyFoodDAO(FoodPartyFood foodPartyFood, Restaurant restaurant) {
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
