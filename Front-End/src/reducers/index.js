import {combineReducers} from "redux";
import OrdersReducer from "./Orders/OrdersReducer";
import CartReducer from "./Cart/CartReducer";
import UserReducer from './User/UserReducer';
import googleAuthenticationReducer from './googleAuthenticationReducer/googleAuthenticationReducer';


export default combineReducers({orders: OrdersReducer, 
                                cart: CartReducer,
                                user: UserReducer,
                                googleAuthentication: googleAuthenticationReducer
                               });