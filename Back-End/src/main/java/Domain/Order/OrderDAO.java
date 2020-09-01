package Domain.Order;

public class OrderDAO {
    private String id;
    private String status;
    private String userId;
    private long deliveryStartTime;
    private long deliveryTime;

    public OrderDAO() {}

    public OrderDAO(String id, String status, String userId, long deliveryStartTime, long deliveryTime) {
        this.id = id;
        this.status = status;
        this.userId = userId;
        this.deliveryStartTime = deliveryStartTime;
        this.deliveryTime = deliveryTime;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public long getDeliveryStartTime() {
        return deliveryStartTime;
    }

    public void setDeliveryStartTime(long deliveryStartTime) {
        this.deliveryStartTime = deliveryStartTime;
    }

    public long getDeliveryTime() {
        return deliveryTime;
    }

    public void setDeliveryTime(long deliveryTime) {
        this.deliveryTime = deliveryTime;
    }
}
