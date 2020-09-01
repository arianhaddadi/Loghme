package Utilities;

import Utilities.Request.GetRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.SignatureException;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class TokenProvider {
    private static final String CLIENT_ID = "467864659090-qdhdvpgingk25pvq8m81gusn9tmflcgt.apps.googleusercontent.com";
    private static final String SECRET_KEY = "loghmeloghmeloghmeloghmeloghmeloghmeloghmeloghmeloghmeloghmeloghme";
    public static final String HEADER = "Authorization";
    public static final String PREFIX = "Bearer ";
    public static final int EXPIRATION_DAYS = 10;
    private static TokenProvider instance;

    private TokenProvider() {
    }

    public static TokenProvider getInstance() {
        if (instance == null) {
            instance = new TokenProvider();
        }
        return instance;
    }

    public String getEmailFromGoogleToken(String idTokenString) {
        GetRequest getRequest = new GetRequest("https://oauth2.googleapis.com/tokeninfo?id_token=" + idTokenString);
        getRequest.send();
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode response = mapper.readTree(getRequest.getResponseString());
            String email = response.get("email").asText();
            boolean emailVerified = response.get("email_verified").asBoolean();
            long exp = response.get("exp").asLong();
            long timestamp = System.currentTimeMillis() / 1000;
            if(emailVerified && (timestamp < exp)) {
                return email;
            }
        } catch (IOException e) {
        }
        return null;
    }

    public String createToken(String userEmail) {
        String jwtToken = Jwts.builder()
                .setIssuer("login")
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_DAYS * 24 * 3600 * 1000))
                .claim("userEmail", userEmail)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                .compact();

        return jwtToken;
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey((TokenProvider.SECRET_KEY).getBytes(StandardCharsets.UTF_8)).parse(authToken);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUserEmailFromToken(String authToken) {
        try {
            return Jwts.parser()
                    .setSigningKey((TokenProvider.SECRET_KEY).getBytes(StandardCharsets.UTF_8))
                    .parseClaimsJws(authToken)
                    .getBody().get("userEmail")
                    .toString();
        } catch (SignatureException e) {
            return "";
        }
    }
}
