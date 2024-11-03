import {Reducer} from "redux";
import {ActionCreatorReturnType, Nullable, User} from "../utils/types";
import {ActionTypes} from "../actions";

export type UserState = Nullable<User>;

const initialState: UserState = null;

const UserReducer: Reducer<UserState, ActionCreatorReturnType<User>> = (state = initialState, action) => {
    if (action.type === ActionTypes.USER) {
        return action.payload;
    }
    return state;
}

export default UserReducer;