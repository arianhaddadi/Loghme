import axios from 'axios';
import configs from '../configs';

export const fetchAndStoreOrders = () => {
    return async (dispatch, getState) => {
        axios.get(`${configs.server_url}/orders`, { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}}).then(
            response => {
                dispatch({
                    type:"ORDERS",
                    payload:response.data.list
                });
            }
        ).catch(error => {
            const history = getState().history;
            if (error.response.status === 403 && history.location.pathname !== "/login") {
                history.push("/login");
            }   
        });
    }
}

export const fetchAndStoreCart = () => {
    return async (dispatch, getState) => {
        axios.get(`${configs.server_url}/carts`, { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}}).then(
            response => {
                dispatch({
                    type:"CART",
                    payload:response.data
                });
            }
        ).catch(error => {
            const history = getState().history;
            if (error.response.status === 403 && history.location.pathname !== "/login") {
                history.push("/login");
            }   
        });
    }
}

export const fetchAndStoreFoodPartyInformation = () => {
    return async (dispatch, getState) => {
        axios.get(`${configs.server_url}/foodparties`, { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}}).then(
            response => {
                dispatch({
                    type:"FOOD_PARTY",
                    payload:response.data
                });
            }
        ).catch(error => {
            const history = getState().history;
            if (error.response.status === 403 && history.location.pathname !== "/login") {
                history.push("/login");
            }   
        });
    }
}

export const fetchAndStoreRestaurants = (pageSize, pageNum) => {
    return async (dispatch, getState) => {
        axios.get(`${configs.server_url}/restaurants?pageSize=${pageSize}&pageNum=${pageNum}`, { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}}).then(
            response => {
                dispatch({
                    type:"RESTAURANTS",
                    payload:response.data.list
                });
            }
        ).catch(error => {
            const history = getState().history;
            if (error.response.status === 403 && history.location.pathname !== "/login") {
                history.push("/login");
            }   
        });
    }
}

export const fetchAndStoreUserInfo = () => {
    return async (dispatch, getState) => {
        axios.get(`${configs.server_url}/profiles`, { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}}).then(
            response => {
                dispatch({
                    type:"USER",
                    payload:response.data
                });
            }
        ).catch(error => {
            const history = getState().history;
            if (error.response.status === 403 && history.location.pathname !== "/login") {
                history.push("/login");
            }   
        });
    }
}

export const fetchAndStoreRestaurant = (restaurantId) => {
    return async (dispatch, getState) => {
        axios.get(`${configs.server_url}/restaurants/${restaurantId}`, { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}}).then(
            response => {
                dispatch({
                    type:"RESTAURANT",
                    payload:response.data
                });
            }
        ).catch(error => {
            const history = getState().history;
            if (error.response.status === 403 && history.location.pathname !== "/login") {
                history.push("/login");
            }   
        });
    }
}

export const clearRestaurants = () => {
    return {
        type:"CLEAR_RESTAURANTS",
        payload:null
    }
}

export const storeGoogleAuthenticationObject = (authenticationObject) => {
    return {
        type:"AUTHENTICATION",
        payload:authenticationObject
    }
}

export const storeHistoryObject = (history) => {
    return {
        type:"HISTORY",
        payload:history
    }
}

