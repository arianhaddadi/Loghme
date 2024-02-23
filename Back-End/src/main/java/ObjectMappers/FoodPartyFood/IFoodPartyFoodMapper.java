package ObjectMappers.FoodPartyFood;

import Domain.DatabaseDTOs.FoodPartyFoodDTO;
import ObjectMappers.IMapper;

public interface IFoodPartyFoodMapper extends IMapper<FoodPartyFoodDTO, String> {
    void deleteAll();
}
