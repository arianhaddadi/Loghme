const CartReducer = (state = null, action) => {
    if(action.type === "CART") {
        return action.payload;
    }
    return state;
}

export default CartReducer;