import {Reducer} from "redux";
import {ActionCreatorReturnType, Nullable, Order} from "../utils/types";
import {ActionTypes} from "../actions";

export type OrdersState = Nullable<Order[]>;

const initialState: OrdersState = null;

const OrdersReducer: Reducer<OrdersState, ActionCreatorReturnType<Order[]>> = (state = initialState, action) => {
    if (action.type === ActionTypes.ORDERS) {
        return action.payload;
    }
    return state;
}

export default OrdersReducer;