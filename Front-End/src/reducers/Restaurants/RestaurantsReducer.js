const RestaurantsReducer = (state = [], action) => {
    if(action.type === "RESTAURANTS") {
        return state.concat(action.payload);
    }
    else if (action.type === "CLEAR_RESTAURANTS") {
        return [];
    }
    return state;
}

export default RestaurantsReducer;