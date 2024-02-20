package Utilities;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class GetRequest {
    public static String sendGetRequest(String url) {
        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();

            if (connection.getResponseCode() == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }

                in.close();

                return response.toString();
            } else {
                return "The response code of server: " + connection.getResponseCode();
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "Error";
        }
    }
}
