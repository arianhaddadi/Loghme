import {combineReducers} from "redux";
import OrdersReducer from "./Orders/OrdersReducer";
import CartReducer from "./Cart/CartReducer";
import FoodPartyRestaurantsReducer from './FoodParty/FoodPartyRestaurantsReducer';
import FoodPartyTimerReducer from './FoodParty/FoodPartyTimerReducer';
import RestaurantsReducer from './Restaurants/RestaurantsReducer';
import RestaurantReducer from "./Restaurants/RestaurantReducer";
import UserReducer from './User/UserReducer';
import googleAuthenticationReducer from './googleAuthenticationReducer/googleAuthenticationReducer';
import HistoryReducer from "./History/HistoryReducer";


export default combineReducers({orders:OrdersReducer, 
                                cart:CartReducer,
                                restaurants:RestaurantsReducer,
                                foodPartyRestaurants:FoodPartyRestaurantsReducer,
                                foodPartyTimer:FoodPartyTimerReducer,
                                user:UserReducer,
                                restaurant:RestaurantReducer,
                                googleAuthentication:googleAuthenticationReducer,
                                history:HistoryReducer});