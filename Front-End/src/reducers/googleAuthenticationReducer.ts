import {Reducer} from "redux";
import {ActionCreatorReturnType, GoogleAuthObject, Nullable} from "../utils/types";
import {ActionTypes} from "../actions";

export type GoogleAuthState = Nullable<GoogleAuthObject>;

const initialState: GoogleAuthState = null;

const googleAuthenticationReducer: Reducer<GoogleAuthState, ActionCreatorReturnType<GoogleAuthObject>> = (state = initialState, action) => {
    if (action.type === ActionTypes.GOOGLE_AUTH) {
        return action.payload;
    }
    return state;
}

export default googleAuthenticationReducer;