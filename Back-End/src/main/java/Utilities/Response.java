package Utilities;

public class Response<T> {
    private String message;
    T payload;
    private final boolean successful;

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

    public boolean getSuccessful() {return successful;}

    public T getPayload() {
        return payload;
    }
}
