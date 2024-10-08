package Domain.Entities;

public class Food {
    protected String name;
    protected String description;
    protected String image;
    protected float price;
    protected float popularity;

    public Food(String name, String description, String image, float price, float popularity) {
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
        this.popularity = popularity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }

    public float getPopularity() {
        return popularity;
    }

    public void setPopularity(float popularity) {
        this.popularity = popularity;
    }
}
