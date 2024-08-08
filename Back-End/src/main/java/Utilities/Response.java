package Utilities;

public class Response<T> {
    private final boolean successful;
    T payload;
    private String message;

    public Response(String message, boolean successful) {
        this.message = message;
        this.successful = successful;
    }

    public Response(T payload, boolean successful) {
        this.payload = payload;
        this.successful = successful;
    }

    public String getMessage() {
        return message;
    }

    public boolean getSuccessful() {
        return successful;
    }

    public T getPayload() {
        return payload;
    }
}
