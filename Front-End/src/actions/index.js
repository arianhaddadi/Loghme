import axios from 'axios';
import configs from '../configs';

export const fetchAndStoreOrders = () => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/orders`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}).then(
            response => {
                dispatch({
                    type:"ORDERS",
                    payload:response.data.list
                });
            }
        ).catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }   
        });
    }
}

export const fetchAndStoreCart = () => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/carts`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}).then(
            response => {
                dispatch({
                    type:"CART",
                    payload:response.data
                });
            }
        ).catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }   
        });
    }
}

export const fetchAndStoreFoodPartyInformation = () => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/foodparties`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}).then(
            response => {
                dispatch({
                    type:"FOOD_PARTY",
                    payload:response.data
                });
            }
        ).catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }   
        });
    }
}

export const fetchAndStoreRestaurants = (pageSize, pageNum) => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/restaurants?pageSize=${pageSize}&pageNum=${pageNum}`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}).then(
            response => {
                dispatch({
                    type:"RESTAURANTS",
                    payload:response.data.list
                });
            }
        ).catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }   
        });
    }
}

export const fetchAndStoreUserInfo = () => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/profiles`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}).then(
            response => {
                dispatch({
                    type:"USER",
                    payload:response.data
                });
            }
        ).catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }   
        });
    }
}

export const fetchAndStoreRestaurant = (restaurantId) => {
    return (dispatch) => {
        axios.get(`${configs.server_url}/restaurants/${restaurantId}`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}).then(
            response => {
                dispatch({
                    type:"RESTAURANT",
                    payload:response.data
                });
            }
        ).catch(error => {
            const pathname = window.location.pathname;
            if (error.response.status === 403 && pathname !== "/login") {
                window.location.href = "/login";
            }   
        });
    }
}

export const clearRestaurants = () => {
    return {
        type: "CLEAR_RESTAURANTS",
        payload:null
    }
}

export const storeGoogleAuthenticationObject = (authenticationObject) => {
    return {
        type: "AUTHENTICATION",
        payload:authenticationObject
    }
}

