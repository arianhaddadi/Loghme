package Entities;

public class Location {
    private final float x, y;

    public Location(float x, float y) {
        this.x = x;
        this.y = y;
    }

    public float getX() {
        return x;
    }

    public float getY() {
        return y;
    }

    public double calculateDistance(Location otherLocation) {
        return Math.sqrt(Math.pow(this.x - otherLocation.x, 2) + Math.pow(this.y - otherLocation.y, 2));
    }

    @Override
    public String toString() {
        return "(" + x + ", " + y + ")";
    }
}
