import * as actionTypes from './actionTypes';
export const updateTarget = (target_id)=>{
    return{
        type: actionTypes.UPDATE_TARGET,
        target_id: target_id 
    }
}