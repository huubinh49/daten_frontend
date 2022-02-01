import thunk from 'redux-thunk';
import { root_reducer } from '.';
const redux = require("redux");

const store = redux.createStore(root_reducer, redux.applyMiddleware(thunk));
store.subscribe(()=>{
    console.log(store.getState().auth)
})
export default store;