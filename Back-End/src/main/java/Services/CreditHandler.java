package Services;

import Domain.User.UsersManager;
import Services.Utilities.ResponseMessage;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
public class CreditHandler {

    @RequestMapping(value = "/credits", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseMessage addCredit(@RequestAttribute(value = "userEmail") String userEmail,
                                     @RequestParam(value = "amount") float amount) {
        UsersManager.getInstance().addCredit(userEmail, amount);
        return new ResponseMessage("Successfully added " + amount + " to your credit!", true);
    }

}