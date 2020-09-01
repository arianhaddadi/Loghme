package Utilities;

import Domain.User.UsersManager;
import Entities.User;
import PeriodicJobs.FoodPartyUpdater;
import Domain.Restaurant.RestaurantsManager;
import Utilities.Request.GetRequest;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@WebListener
public class CollectDataAndSchedule implements ServletContextListener {

    private ScheduledExecutorService scheduler;
    private static FoodPartyUpdater foodPartyUpdater = new FoodPartyUpdater(30);

    public static FoodPartyUpdater getFoodPartyUpdater() {
        return foodPartyUpdater;
    }

    @Override
    public void contextInitialized(ServletContextEvent event) {
        GetRequest getRequest = new GetRequest(RestaurantsManager.RESTAURANTS_SERVER_URL);
        getRequest.send();
        RestaurantsManager.getInstance().setRestaurants(RestaurantsManager.getInstance().parseListOfJson(getRequest.getResponseString()));
        RestaurantsManager.maxDistance = 170;
        scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(foodPartyUpdater::run, 0, 30, TimeUnit.MINUTES);
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        scheduler.shutdownNow();
    }

}
