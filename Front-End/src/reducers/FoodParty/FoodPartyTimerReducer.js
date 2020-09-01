const FoodPartyTimerReducer = (state = null, action) => {
    if(action.type === "FOOD_PARTY") {
        return {
            minutes:action.payload.responseMessage.minutes,
            seconds:action.payload.responseMessage.seconds
        }
    }
    return state; 
}

export default FoodPartyTimerReducer;