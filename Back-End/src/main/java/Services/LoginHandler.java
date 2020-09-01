package Services;

import Domain.Cart.CartsManager;
import Domain.User.UsersManager;
import Entities.Cart;
import Entities.User;
import Services.Utilities.ResponseMessage;
import Utilities.TokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginHandler {

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity login(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "password") String password,
            @RequestParam(value = "isGoogleAuth") boolean isGoogleAuth,
            @RequestParam(value = "idToken") String idToken) {

        return UsersManager.getInstance().login(email, password, isGoogleAuth, idToken);
    }

}
