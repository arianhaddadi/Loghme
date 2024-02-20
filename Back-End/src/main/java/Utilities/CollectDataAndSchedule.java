package Utilities;

import Entities.Restaurant;
import PeriodicJobs.FoodPartyUpdater;
import Domain.Restaurant.RestaurantsManager;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@WebListener
public class CollectDataAndSchedule implements ServletContextListener {

    private ScheduledExecutorService scheduler;
    private static final FoodPartyUpdater foodPartyUpdater = new FoodPartyUpdater(30);
    public static FoodPartyUpdater getFoodPartyUpdater() {
        return foodPartyUpdater;
    }

    @Override
    public void contextInitialized(ServletContextEvent event) {
//        String responseString = GetRequest.sendGetRequest(RestaurantsManager.RESTAURANTS_SERVER_URL);
//        ArrayList<Restaurant> restaurants = RestaurantsManager.getInstance().parseListOfJson(responseString);
        ArrayList<Restaurant> restaurants = DataProvider.getRestaurants();
        RestaurantsManager.getInstance().setRestaurants(restaurants);
//        scheduler = Executors.newSingleThreadScheduledExecutor();
//        scheduler.scheduleAtFixedRate(foodPartyUpdater::run, 0, 30, TimeUnit.MINUTES);
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        scheduler.shutdownNow();
    }

}
