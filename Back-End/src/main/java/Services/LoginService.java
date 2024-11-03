package Services;

import Domain.Managers.UsersManager;
import Utilities.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginService {

    @RequestMapping(
            value = "/login",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Void> login(
            @RequestParam(value = "email") String email,
            @RequestParam(value = "password") String password,
            @RequestParam(value = "isGoogleAuth") boolean isGoogleAuth,
            @RequestParam(value = "idToken") String idToken) {

        return UsersManager.getInstance().login(email, password, isGoogleAuth, idToken);
    }
}
