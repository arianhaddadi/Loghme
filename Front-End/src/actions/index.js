import { sendRequest, RequestMethods } from '../utils';

export const fetchAndStoreOrders = () => {
    return (dispatch) => {
        const requestArgs = {
            method: RequestMethods.GET,
            url: "/orders",
            successHandler: (response) => dispatch({type: "ORDERS", payload: response.data.payload}),
            errorHandler: (error) => console.log("Fetching Orders Failed.", error)
        }
        sendRequest(requestArgs)
    }
}

export const fetchAndStoreCart = () => {
    return (dispatch) => {
        const requestArgs = {
            method: RequestMethods.GET,
            url: "/carts",
            successHandler: (response) => dispatch({type: "CART", payload: response.data}),
            errorHandler: (error) => console.log("Fetching Cart Failed.", error)
        }
        sendRequest(requestArgs)
    }
}

export const fetchAndStoreUserInfo = () => {
    return (dispatch) => {
        const requestArgs = {
            method: RequestMethods.GET,
            url: "/profiles",
            successHandler: (response) => dispatch({type: "USER", payload: response.data}),
            errorHandler: (error) => console.log("Fetching User Profile Failed.", error)
        }
        sendRequest(requestArgs)
    }
}

export const storeGoogleAuthenticationObject = (authenticationObject) => {
    return {
        type: "AUTHENTICATION",
        payload: authenticationObject
    }
}

