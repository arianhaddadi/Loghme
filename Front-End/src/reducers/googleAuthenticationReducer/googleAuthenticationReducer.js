const googleAuthenticationReducer = (state = null, action) => {
    if (action.type === "AUTHENTICATION") {
        return action.payload;
    }
    return state;
}

export default googleAuthenticationReducer;