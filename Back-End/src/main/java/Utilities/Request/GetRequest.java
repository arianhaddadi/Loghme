package Utilities.Request;

import java.io.IOException;
import java.net.HttpURLConnection;

public class GetRequest extends Request {
    public GetRequest(String urlString) {
        super(urlString);
    }

    public void send() {
        try {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            checkStatusCodeAndSetResponse(connection);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
