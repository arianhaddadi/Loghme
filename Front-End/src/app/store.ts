import {configureStore} from '@reduxjs/toolkit'
import OrdersReducer from "../reducers/OrdersReducer.ts";
import CartReducer from "../reducers/CartReducer.ts";
import UserReducer from '../reducers/UserReducer.ts';
import googleAuthenticationReducer from '../reducers/googleAuthenticationReducer.ts';

const store = configureStore({
    reducer: {
        orders: OrdersReducer,
        cart: CartReducer,
        user: UserReducer,
        googleAuthentication: googleAuthenticationReducer
    }
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;