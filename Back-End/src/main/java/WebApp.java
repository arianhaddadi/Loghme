import Domain.Managers.FoodPartyManager;
import Domain.Managers.RestaurantsManager;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class WebApp implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent event) {
        RestaurantsManager.getInstance().initialize();
//        FoodPartyManager.getInstance().initialize();
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        FoodPartyManager.getInstance().shutdownFoodParty();
    }

}
