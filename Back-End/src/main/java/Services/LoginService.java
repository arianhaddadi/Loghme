package Services;

import Domain.User.UsersManager;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class LoginService {

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity login(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "password") String password,
            @RequestParam(value = "isGoogleAuth") boolean isGoogleAuth,
            @RequestParam(value = "idToken") String idToken) {

        return UsersManager.getInstance().login(email, password, isGoogleAuth, idToken);
    }

}
