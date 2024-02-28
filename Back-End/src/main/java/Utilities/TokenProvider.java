package Utilities;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Date;

public class TokenProvider {
    public static final String HEADER = "Authorization";
    public static final String PREFIX = "Bearer ";
    private static final String TOKEN_ISSUER = "login";
    private static TokenProvider instance;
    private static final String JWT_TOKEN_SECRET = "loghmeloghmeloghmeloghmeloghmeloghmeloghmeloghmeloghmeloghmeloghme";
    private static final int LOGIN_TOKEN_EXPIRATION_DAYS = 10;
    private TokenProvider() {}

    public static TokenProvider getInstance() {
        if (instance == null) {
            instance = new TokenProvider();
        }
        return instance;
    }

    public String getEmailFromGoogleToken(String idTokenString) {
        try {
            String responseBody = GetRequest.sendGetRequest("https://oauth2.googleapis.com/tokeninfo?id_token=" + idTokenString);
            JsonNode response = new ObjectMapper().readTree(responseBody);
            String email = response.get("email").asText();
            boolean emailVerified = response.get("email_verified").asBoolean();
            long exp = response.get("exp").asLong();
            long timestamp = System.currentTimeMillis() / 1000;
            if(emailVerified && (timestamp < exp)) {
                return email;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String createToken(String userEmail) {
        return Jwts.builder()
                .issuer(TOKEN_ISSUER)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + LOGIN_TOKEN_EXPIRATION_DAYS * 24 * 3600 * 1000))
                .claim(Configs.USER_ID_ATTRIBUTE, userEmail)
                .signWith(Keys.hmacShaKeyFor(JWT_TOKEN_SECRET.getBytes(StandardCharsets.UTF_8)))
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(JWT_TOKEN_SECRET.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parse(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUserEmailFromToken(String token) {
        try {
            return Jwts.parser()
                       .verifyWith(Keys.hmacShaKeyFor(JWT_TOKEN_SECRET.getBytes(StandardCharsets.UTF_8)))
                       .build()
                       .parseSignedClaims(token)
                       .getPayload().get(Configs.USER_ID_ATTRIBUTE)
                       .toString();
        } catch (SignatureException e) {
            return "";
        }
    }
}
