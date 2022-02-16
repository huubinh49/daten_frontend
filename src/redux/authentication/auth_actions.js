import * as actionTypes from './actionTypes'
import axiosClient from '../../api/axiosClient'
import decode from 'jwt-decode'
export const authStart = ()=>{
    return{
        type:actionTypes.AUTH_START
    }
}
export const authSuccess = (token)=>{
    localStorage.setItem('user_id', decode(token).id)
    localStorage.setItem('access_token', token)
    return{
        type:actionTypes.AUTH_SUCCESS,
        token: token
    }
}
export const authFail = (error)=>{
    return{
        type:actionTypes.AUTH_FAIL,
        error: error
    }
}

export const authLogout = ()=>{
    localStorage.removeItem('user_id')
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expiration');
    return {
        type: actionTypes.AUTH_LOGOUT,
        token: null
    };
}
export const checkAuthentication = ()=>{
    return async dispatch =>{
        const access = localStorage.getItem("access_token") 
        const refresh = localStorage.getItem("refresh_token")
        if(!access && !refresh){
            dispatch(authLogout());
        }else{
            const exp_refresh = decode(refresh).exp;
            if(exp_refresh*1000 <= new Date().getTime()){
                console.log('refresh token out of date')
                dispatch(authLogout());
                return;
            }else{
                const exp_access = decode(access).exp;
                if(exp_access*1000 <= new Date().getTime()){
                    await dispatch(obtainNewAccessToken(refresh))
                    return;
                }else{
                    await dispatch(authSuccess(access))
                }
            }
        }
    }
}

export function authSignup(formData, onSuccess = () => {}, onFailure = (err) => {}){
    return async  dispatch =>{
        dispatch(authStart());
        try{
            const token = await axiosClient.post('/auth/signup/',{
                email: formData.getAll("email")[0],
                password: formData.getAll("password")[0],
            }
            ,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
            )
            localStorage.setItem('refresh_token', token.refresh_token)
            dispatch(authSuccess(token.access_token))
            onSuccess();
        }catch(err){
            dispatch(authFail(err))
            onFailure(err);
        }
    }   
}
export  function authLogin(formData, onSuccess = () => {}, onFailure = (err) => {}){
    return async dispatch => {
        dispatch(authStart());
        try{
            const token = await axiosClient.post('/auth/login/',{
                email: formData.getAll("email")[0],
                password: formData.getAll("password")[0],
            },{
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            localStorage.setItem('refresh_token', token.refresh_token)
            dispatch(authSuccess(token.access_token))
            onSuccess();
        }catch(err){
            onFailure(err);
            dispatch(authFail(err))
        }
    }
}

export  function obtainNewAccessToken (refresh_token){
    return async dispatch =>{
        dispatch(authStart())
        try{
            const res = await axiosClient.post('/auth/refresh-token',{
                'refresh_token': refresh_token
            },  {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            const newAccessToken = res.access_token;
            dispatch(authSuccess(newAccessToken))
        }catch(err){
            console.log(err)
            dispatch(authFail(err));
        }
    }
}


export  function OAuthLogin(response, provider, onSuccess = () => {}, onFailure = (err) => {}){
    const access_token = response.accessToken;
    return async dispatch =>{
        dispatch(authStart());
        try{
            const token = await axiosClient.post(`auth/${provider}/token`,{
                access_token
            },{
                headers: {
                    'Authorization': `JWT ${access_token}`
                },
            })
            localStorage.setItem('refresh_token', token.refresh_token)
            dispatch(authSuccess(token.access_token))
            onSuccess();
        }catch(err){
            onFailure(err)
            dispatch(authFail(err))
        }
    }
}