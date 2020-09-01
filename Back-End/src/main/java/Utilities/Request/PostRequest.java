package Utilities.Request;

import java.io.IOException;
import java.net.HttpURLConnection;

public class PostRequest extends Request{
    public PostRequest(String urlString) {
        super(urlString);
    }

    public void send() {
        try {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            checkStatusCodeAndSetResponse(connection);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
