import { Reducer } from "redux";
import { ActionCreatorReturnType, Cart, Nullable } from "../utils/types";
import { ActionTypes } from "../actions";

export type CartState = Nullable<Cart>

const initialState: CartState = null;

const CartReducer: Reducer<CartState, ActionCreatorReturnType<Cart>> = (state = initialState, action) => {
    if(action.type === ActionTypes.CART) {
        return action.payload;
    }
    return state;
}

export default CartReducer;