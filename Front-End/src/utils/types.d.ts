import { UnknownAction } from "redux"

export interface Notification {
    status: string,
    message: string
}

export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type ActionCreator<P, A = undefined> = (arg?: A) => ActionCreatorReturnType<P> | void

export interface ActionCreatorReturnType<T> extends UnknownAction {
    payload: T
}

export type GoogleAuthObject = any;

export interface RequestArguments {
    method: number;
    url: string;
    successHandler: (response: any) => void;
    errorHandler: (error: any) => void;
}

export interface Food {
    name: string,
    description: string,
    image: string,
    price: number,
    popularity: number,
    count?: number;
    oldPrice?: number;
}

export interface CartItem {
    food: Food,
    quantity: number
}

export interface Location {
    x: number,
    y: number
}

export interface Restaurant {
    id: string,
    name: string,
    logo: string,
    location: Location,
    menu: Food[],
    foodPartyMenu: Food[]
}

export interface Cart {
    cartItems: CartItem[],
    restaurant: Restaurant,
    empty: boolean,
    sum: number,
    restaurantId: string
}

export interface Order {
    id: string,
    userId: string,
    status: string,
    cart: Cart
}

export interface User {
    name: string,
    familyName: string,
    phoneNumber: string,
    email: string,
    credit: number
}