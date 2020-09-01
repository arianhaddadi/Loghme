const UserReducer = (state = null, action) => {
    if(action.type === "USER") {
        return action.payload;
    }
    return state;
}


export default UserReducer;