import axios from 'axios';
import configs from '../configs';

export const fetchAndStoreOrders = () => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/orders`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
                dispatch({
                    type: "ORDERS",
                    payload: response.data.payload
                });
        })
        .catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }
            else {
                console.log("Fetching Orders Failed", error)
            } 
        });
    }
}

export const fetchAndStoreCart = () => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/carts`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
                dispatch({
                    type: "CART",
                    payload: response.data
                });
        })
        .catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }
            else {
                console.log("Fetching Cart Failed", error)
            }
        });
    }
}

export const fetchAndStoreUserInfo = () => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/profiles`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
                dispatch({
                    type: "USER",
                    payload: response.data
                });
        })
        .catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }
            else {
                console.log("Fetching User Profile Failed", error)
            }   
        });
    }
}

export const storeGoogleAuthenticationObject = (authenticationObject) => {
    return {
        type: "AUTHENTICATION",
        payload: authenticationObject
    }
}

