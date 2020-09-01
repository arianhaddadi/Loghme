package Services.Utilities;

public class ResponseMessage {
    private String message;
    private int minutes;
    private int seconds;
    private boolean successful;

    public ResponseMessage(String message, boolean successful) {
        this.message = message;
        this.successful = successful;
    }

    public ResponseMessage(int minutes, int seconds, boolean successful) {
        this.minutes = minutes;
        this.seconds = seconds;
        this.successful = successful;
    }

    public String getMessage() {
        return this.message;
    }

    public boolean getSuccessful() {return this.successful;}

    public int getMinutes() {
        return minutes;
    }

    public int getSeconds() {
        return seconds;
    }
}
