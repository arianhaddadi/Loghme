package PeriodicJobs;

import Domain.Managers.RestaurantsManager;
import Domain.Entities.Restaurant;
import ObjectMappers.FoodPartyFood.FoodPartyFoodMapper;
import Utilities.GetRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class FoodPartyUpdater implements Runnable, Callable<Void> {
    private static final String FOODPARTY_URL = "http://138.197.181.131:8080/foodparty";
    private int minutes;
    private int seconds;
    private final int period;
    private ScheduledExecutorService scheduler;

    public FoodPartyUpdater(int period) {
        this.period = period;
        this.resetTimer();
    }

    public int getMinutes() {
        return minutes;
    }

    public int getSeconds() {
        return seconds;
    }

    private void deleteOldInfo() {
        FoodPartyFoodMapper.getInstance().deleteAll();
    }

    private void insertInfoToDB() {
        ArrayList<Restaurant> restaurants = fetchInfo();
        RestaurantsManager.getInstance().insertRestaurants(restaurants);
    }

    private void resetTimer() {
        minutes = period;
        seconds = 0;
    }

    private void resetScheduler() {
        if(scheduler != null) {
            scheduler.shutdownNow();
        }
        scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.schedule(this::call, 1, TimeUnit.SECONDS);
    }

    public void shutDown() {
        scheduler.shutdown();
    }

    private ArrayList<Restaurant> fetchInfo() {
        String responseString = GetRequest.sendGetRequest(FOODPARTY_URL);
        try {
            Restaurant[] restaurants = new ObjectMapper().readValue(responseString.replaceAll("menu", "foodPartyMenu"), Restaurant[].class);
            return new ArrayList<>(Arrays.asList(restaurants));
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ArrayList<>();
    }

    @Override
    public void run() {
        deleteOldInfo();
        insertInfoToDB();
        resetTimer();
        resetScheduler();
    }

    @Override
    public Void call() {
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
