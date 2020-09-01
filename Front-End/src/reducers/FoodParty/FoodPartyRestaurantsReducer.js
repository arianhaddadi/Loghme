const FoodPartyRestaurantsReducer = (state = null, action) => {
    if(action.type === "FOOD_PARTY") {
        return action.payload.list;
    }
    return state;
}

export default FoodPartyRestaurantsReducer;