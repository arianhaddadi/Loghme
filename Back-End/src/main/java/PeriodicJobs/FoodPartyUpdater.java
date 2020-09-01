package PeriodicJobs;

import Domain.Restaurant.RestaurantsManager;
import Entities.Restaurant;
import Utilities.Request.GetRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class FoodPartyUpdater implements Runnable, Callable {
    private String FoodParty_URL = "http://138.197.181.131:8080/foodparty";
    private int minutes, seconds, period;
    private ScheduledExecutorService scheduler;

    public FoodPartyUpdater(int period) {
        this.period = period;
    }

    public int getMinutes() {
        return minutes;
    }

    public int getSeconds() {
        return seconds;
    }

    private void clearFoodParty() {
        RestaurantsManager.getInstance().getFoodPartyFoodMapper().deleteAll();
    }

    private void addGivenRestaurants(ArrayList<Restaurant> restaurants) {
        RestaurantsManager.getInstance().setRestaurants(restaurants);
    }

    private void resetTimer() {
        minutes = period;
        seconds = 0;
    }

    private void shutDownPreviousSchedulerAndCreateNewOne() {
        if(scheduler != null) {
            scheduler.shutdownNow();
        }
        scheduler = Executors.newSingleThreadScheduledExecutor();
    }

    @Override
    public void run() {
        clearFoodParty();
        GetRequest getRequest = new GetRequest(FoodParty_URL);
        getRequest.send();
        try {
            ArrayList<Restaurant> restaurants = new ArrayList<>(Arrays.asList(new ObjectMapper().readValue(getRequest.getResponseString().replaceAll("menu", "foodPartyMenu"), Restaurant[].class)));
            addGivenRestaurants(restaurants);
            resetTimer();
            shutDownPreviousSchedulerAndCreateNewOne();
            scheduler.schedule(this::call, 1, TimeUnit.SECONDS);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Void call() throws Exception {
        if (seconds != 0 || minutes != 0) {
            if(seconds == 0) {
                seconds = 59;
                minutes -= 1;
            }
            else {
                seconds -= 1;
            }
            if(seconds != 0 || minutes != 0) {
                scheduler.schedule(this::call, 1 , TimeUnit.SECONDS);
            }
        }
        return null;
    }
}
