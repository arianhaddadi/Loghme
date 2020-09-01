package Domain.User;

import Domain.Cart.CartDAO;
import Domain.Cart.CartsManager;
import Entities.*;
import Mappers.Cart.CartMapper;
import Mappers.User.UserMapper;
import Services.Utilities.ResponseMessage;
import Utilities.TokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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
        UserMapper.getInstance().insert(new UserDAO(user));
        CartMapper.getInstance().insert(new CartDAO(user.getEmail(), ""));
    }

    public void addCredit(String userEmail, float amount) {
        UserDAO user = UserMapper.getInstance().find(userEmail);
        float newAmount = user.getCredit() + amount;
        user.setCredit(newAmount);
        UserMapper.getInstance().update(user);
    }

    public User findUserByEmail(String email) {
        UserDAO userDAO = UserMapper.getInstance().find(email);
        if(userDAO != null) {
            User user = userDAO.getUserForm();
            user.setCart(CartsManager.getInstance().getCart(email));
            return user;
        }
        else {
            return null;
        }
    }

    public boolean checkUserEmailAndPassword(String email, String password) {
        UserDAO user = UserMapper.getInstance().findUserByEmailAndPassword(email, Integer.toString(password.hashCode()));
        return !(user == null);
    }

    public ResponseEntity login(String email, String password, boolean isGoogleAuth, String idToken) {
        if((isGoogleAuth && verifyGoogleToken(idToken)) || checkUserEmailAndPassword(email, password)) {
            String token = TokenProvider.getInstance().createToken(email);
            return new ResponseEntity(new ResponseMessage(token, true), HttpStatus.OK);
        }
        else {
            return new ResponseEntity(new ResponseMessage("", false), HttpStatus.FORBIDDEN);
        }
    }

    private boolean verifyGoogleToken(String idToken) {
        String email = TokenProvider.getInstance().getEmailFromGoogleToken(idToken);
        if(email == null) {
            return false;
        }
        else {
            User user = findUserByEmail(email);
            if(user == null) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    public ResponseMessage signup(String firstName, String lastName, String email, String password, String phoneNumber) {
        User user = findUserByEmail(email);
        if(user == null) {
            addUser(new User(firstName, lastName, email, Integer.toString(password.hashCode()), phoneNumber, 0));
            return new ResponseMessage("", true);
        }
        else {
            return new ResponseMessage("", false);
        }
    }

}
