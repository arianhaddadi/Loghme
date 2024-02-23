package Services;

import Domain.Managers.UsersManager;
import Domain.Entities.User;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileService {

    @RequestMapping(value = "/profiles", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public User getProfile(@RequestAttribute(value = "userEmail") String userEmail) {
        return UsersManager.getInstance().findUserByEmail(userEmail);
    }

}
