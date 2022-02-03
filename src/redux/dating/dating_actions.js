import * as actionTypes from './actionTypes'

export const updateProfile = (profile)=>{
    return{
        type: actionTypes.UPDATE_PROFILE,
        profile
    }
}