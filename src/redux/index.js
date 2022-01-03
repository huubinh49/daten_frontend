import { combineReducers } from "redux";
import { authReducer } from "./authentication/auth_reducers";
const root_reducer = combineReducers({
    auth: authReducer,
})
export {root_reducer};