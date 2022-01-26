import * as actionTypes from './actionTypes'
const initialState = {
    target_id: ""
}
const updateTarget = (state, action)=>{
    return updateState(state, {
        target_id: action.target_id
    })
}

export const datingReducer = (state = initialState, action)=>{
    switch (action.type) {
        case actionTypes.UPDATE_TARGET: return updateTarget(state, action)
    
        default:
            return state
    }
}
