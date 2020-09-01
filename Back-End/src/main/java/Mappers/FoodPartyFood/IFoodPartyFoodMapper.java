package Mappers.FoodPartyFood;

import Domain.Restaurant.FoodPartyFoodDAO;
import Mappers.IMapper;

public interface IFoodPartyFoodMapper extends IMapper<FoodPartyFoodDAO, String> {
    void deleteAll();
}
