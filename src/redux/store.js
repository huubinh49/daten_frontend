import thunk from 'redux-thunk';
import { root_reducer } from '.';
const redux = require("redux");
const saveState = (state)=>{
    localStorage.setItem("profile", JSON.stringify(state.dating.profile))
}
const store = redux.createStore(root_reducer, redux.applyMiddleware(thunk));
store.subscribe(()=>{
    saveState(store.getState());
})
export default store;