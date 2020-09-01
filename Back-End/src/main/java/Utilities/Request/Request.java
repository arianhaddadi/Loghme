package Utilities.Request;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class Request {
    protected URL url;
    protected String responseString;
    protected int responseStatusCode;

    public Request(String urlString) {
        try {
            url = new URL(urlString);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    protected void checkStatusCodeAndSetResponse(HttpURLConnection connection) {
        try {
            responseStatusCode = connection.getResponseCode();
            if (responseStatusCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
                responseString = response.toString();
            } else {
                System.out.println("The response code of server: " + responseStatusCode);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public int getResponseStatusCode() {
        return responseStatusCode;
    }

    public String getResponseString() {
        return responseString;
    }

}
