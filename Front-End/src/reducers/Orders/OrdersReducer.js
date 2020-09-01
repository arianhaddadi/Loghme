const OrdersReducer = (state = null, action) => {
    if(action.type === "ORDERS") {
        return action.payload;
    }
    return state;
}

export default OrdersReducer;