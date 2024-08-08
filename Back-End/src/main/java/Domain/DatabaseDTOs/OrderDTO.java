package Domain.DatabaseDTOs;

public class OrderDTO {
    private String id;
    private String status;
    private String userId;

    public OrderDTO() {}

    public OrderDTO(String id, String status, String userId) {
        this.id = id;
        this.status = status;
        this.userId = userId;
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
}
