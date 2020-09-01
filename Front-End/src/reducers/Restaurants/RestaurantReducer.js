const RestaurantReducer = (state = null, action) => {
    if (action.type === "RESTAURANT") {
        return action.payload;
    }
    return state;
}


export default RestaurantReducer;