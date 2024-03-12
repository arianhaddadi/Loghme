import { Dispatch } from 'redux';
import { sendRequest, RequestMethods } from '../utils/request.ts';
import { GoogleAuthObject, RequestArguments } from '../utils/types';

export const ActionTypes = {
    USER: "user",
    ORDERS: "orders",
    CART: "cart",
    GOOGLE_AUTH: "google_auth"
}

export const fetchOrders = () => {
    return (dispatch: Dispatch) => {
        const requestArgs: RequestArguments = {
            method: RequestMethods.GET,
            url: "/orders",
            successHandler: (response) => dispatch({type: ActionTypes.ORDERS, payload: response.data.payload}),
            errorHandler: (error) => console.log("Fetching Orders Failed.", error)
        }
        sendRequest(requestArgs)
    }
}

export const fetchCart = () => {
    return (dispatch: Dispatch) => {
        const requestArgs: RequestArguments = {
            method: RequestMethods.GET,
            url: "/carts",
            successHandler: (response) => dispatch({type: ActionTypes.CART, payload: response.data}),
            errorHandler: (error) => console.log("Fetching Cart Failed.", error)
        }
        sendRequest(requestArgs)
    }
}

export const fetchUserInfo = () => {
    return (dispatch: Dispatch) => {
        const requestArgs: RequestArguments = {
            method: RequestMethods.GET,
            url: "/profiles",
            successHandler: (response) => dispatch({type: ActionTypes.USER, payload: response.data}),
            errorHandler: (error) => console.log("Fetching User Profile Failed.", error)
        }
        sendRequest(requestArgs)
    }
}

export const storeGoogleAuthenticationObject = (authenticationObject: GoogleAuthObject) => {
    return {
        type: ActionTypes.GOOGLE_AUTH,
        payload: authenticationObject
    }
}

