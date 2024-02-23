package Domain.Entities;

public class FoodPartyFood extends Food {
    private int count;
    private float oldPrice;

    public FoodPartyFood(String name, String description, String image,
                        float price, float popularity, int count, float oldPrice) {
        super(name, description, image, price, popularity);
        this.count = count;
        this.oldPrice = oldPrice;
    }

    public int getCount() {
        return count;
    }

    public float getOldPrice() {
        return oldPrice;
    }

    public void decreaseCount(int num) {
        if(count >= num) {
            count -= num;
        }
    }

    public void increaseCount(int num) {
        count += num;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public void setOldPrice(float oldPrice) {
        this.oldPrice = oldPrice;
    }
}
