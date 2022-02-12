import thunk from 'redux-thunk';
import { root_reducer } from '.';
const redux = require("redux");
const saveState = (state)=>{
    localStorage.setItem("profile", JSON.stringify(state.dating.profile))
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || redux.compose;
const store = redux.createStore(root_reducer, composeEnhancers(redux.applyMiddleware(thunk)));
store.subscribe(()=>{
    saveState(store.getState());
})
export default store;