package Domain.Managers;

import PeriodicJobs.FoodPartyUpdater;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class FoodPartyManager {
    private static FoodPartyManager instance;
    private final FoodPartyUpdater foodPartyUpdater = new FoodPartyUpdater(30);
    private ScheduledExecutorService scheduler;
    private FoodPartyManager() {}

    public void initialize() {
        scheduler = Executors.newSingleThreadScheduledExecutor();
        scheduler.scheduleAtFixedRate(foodPartyUpdater, 0, 30, TimeUnit.MINUTES);
    }

    public void shutdownFoodParty() {
        foodPartyUpdater.shutdown();
        scheduler.shutdownNow();
    }

    public int getRemainingMinutes() {
        return foodPartyUpdater.getMinutes();
    }

    public int getRemainingSeconds() {
        return foodPartyUpdater.getSeconds();
    }

    public static FoodPartyManager getInstance() {
        if (instance == null) {
            instance = new FoodPartyManager();
        }
        return instance;
    }
}
