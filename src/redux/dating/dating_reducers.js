import * as actionTypes from './actionTypes'

const getProfileFromLocalStorage = ()=>{
    const initialState = localStorage.getItem("profile");
    if(!initialState || initialState === 'undefined'){
        return {};
    }
    else
    return JSON.parse(initialState);
}

const initialState = {
    profile: getProfileFromLocalStorage()
}

export const datingReducer = (state = initialState, action)=>{
    switch (action.type) {
        case actionTypes.UPDATE_PROFILE: {
            const newState = {...state};
            newState.profile = action.profile
            console.log('request update: ', newState)
            return newState
        }
        default:
            return state
    }
}
