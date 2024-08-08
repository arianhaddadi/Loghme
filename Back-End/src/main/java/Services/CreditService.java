package Services;

import Domain.Managers.UsersManager;
import Utilities.Configs;
import Utilities.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class CreditService {

    @RequestMapping(
            value = "/credits",
            method = RequestMethod.PUT,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<Void> addCredit(
            @RequestAttribute(value = Configs.USER_ID_ATTRIBUTE) String userEmail,
            @RequestParam(value = "amount") float amount) {
        UsersManager.getInstance().addCredit(userEmail, amount);
        return new Response<>("Successfully added " + amount + " to your credit!", true);
    }
}
