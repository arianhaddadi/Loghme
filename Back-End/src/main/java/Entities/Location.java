package Entities;

public class Location {
    private float x, y;

    public Location() {
        this.x = 0;
        this.y = 0;
    }
    public Location(float x, float y) {
        this.x = x;
        this.y = y;
    }

    public float getX() {
        return x;
    }

    public void setX(float x) {
        this.x = x;
    }

    public float getY() {
        return y;
    }

    public void setY(float y) {
        this.y = y;
    }

    public double calculateDistance(Location otherLocation) {
        return Math.sqrt(Math.pow(this.x - otherLocation.x, 2) + Math.pow(this.y - otherLocation.y, 2));
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
