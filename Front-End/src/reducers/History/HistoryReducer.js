const HistoryReducer = (state = null, action) => {
    if (action.type === "HISTORY") {
        return action.payload;
    }
    return state;
}

export default HistoryReducer;