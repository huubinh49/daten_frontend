import { combineReducers } from "redux";
import { authReducer } from "./authentication/auth_reducers";
import { datingReducer } from "./dating/dating_reducers";
const root_reducer = combineReducers({
    auth: authReducer,
    dating: datingReducer
})
export {root_reducer};