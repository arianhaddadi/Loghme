package Domain.Managers;

import Domain.DatabaseDTOs.CartDTO;
import Domain.DatabaseDTOs.UserDTO;
import Domain.Entities.*;
import ObjectMappers.Cart.CartMapper;
import ObjectMappers.User.UserMapper;
import Utilities.Response;
import Utilities.TokenProvider;

public class UsersManager {
    private static UsersManager instance;

    public static UsersManager getInstance() {
        if (instance == null) {
            instance = new UsersManager();
        }
        return instance;
    }

    private UsersManager() {}

    public void addUser(User user) {
        UserMapper.getInstance().insert(new UserDTO(user));
        CartMapper.getInstance().insert(new CartDTO(user.getEmail(), ""));
    }

    public void addCredit(String userEmail, float amount) {
        UserDTO user = UserMapper.getInstance().find(userEmail);
        float newAmount = user.getCredit() + amount;
        user.setCredit(newAmount);
        UserMapper.getInstance().update(user);
    }

    public User findUserByEmail(String email) {
        UserDTO userDTO = UserMapper.getInstance().find(email);
        if(userDTO != null) {
            User user = userDTO.getUserForm();
            user.setCart(CartsManager.getInstance().getCart(email));
            return user;
        }
        else {
            return null;
        }
    }

    public boolean checkUserEmailAndPassword(String email, String password) {
        UserDTO user = UserMapper.getInstance().findUserByEmailAndPassword(email, Integer.toString(password.hashCode()));
        return !(user == null);
    }

    public Response<Void> login(String email, String password, boolean isGoogleAuth, String idToken) {
        if((isGoogleAuth && verifyGoogleToken(idToken)) || checkUserEmailAndPassword(email, password)) {
            String token = TokenProvider.getInstance().createToken(email);
            return new Response<>(token, true);
        }
        else {
            return new Response<>("", false);
        }
    }

    private boolean verifyGoogleToken(String idToken) {
        String email = TokenProvider.getInstance().getEmailFromGoogleToken(idToken);
        if(email == null) {
            return false;
        }
        else {
            User user = findUserByEmail(email);
            return user != null;
        }
    }

    public Response<Void> signup(String firstName, String lastName, String email, String password, String phoneNumber) {
        User user = findUserByEmail(email);
        if(user == null) {
            addUser(new User(firstName, lastName, email, Integer.toString(password.hashCode()), phoneNumber, 0));
            return new Response<>("", true);
        }
        else {
            return new Response<>("", false);
        }
    }

}
