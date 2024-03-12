import axios, { AxiosError } from "axios";
import configs from "../app/configs.ts";
import { RequestArguments } from "./types.ts";
import { redirect } from "./redirect.ts";

const funcs = [
    axios.get,
    axios.post,
    axios.put,
    axios.delete,
]

export const RequestMethods = {
    GET: 0,
    POST: 1,
    PUT: 2,
    DELETE: 3
}

export const sendRequest = ({method, url, successHandler, errorHandler}: RequestArguments) => {
    const func: any = funcs[method];
    const args = [`${configs.server_url}${url}`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}}];
    
    if (method === RequestMethods.GET || method === RequestMethods.DELETE) {
        args.splice(1, 1);
    }

    func(...args)
    .then(successHandler)
    .catch((error: AxiosError) => {
        const pathname = window.location.pathname;
        if (error.response!.status === 401 && pathname !== "/login") {
            redirect("/login")
        } 
        else errorHandler(error);
    })

}