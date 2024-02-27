import axios from "axios";
import configs from "../configs";


const funcs = {
    "get": axios.get,
    "post": axios.post,
    "put": axios.put,
    "delete": axios.delete
}

export const RequestMethods = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete"
}

export const redirect = (url) => {
    window.location.href = url;
}

export const sendRequest = ({method, url, successHandler, errorHandler}) => {
    const func = funcs[method];
    const args = [`${configs.server_url}${url}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}];
    
    if (method === "get" || method === "delete") {
        args.splice(1, 1);
    }

    func(...args)
    .then(successHandler)
    .catch(error => {
        const pathname = window.location.pathname;
        if (error.response.status === 401 && pathname !== "/login") {
            redirect("/login")
        } 
        else errorHandler(error);
    })

}