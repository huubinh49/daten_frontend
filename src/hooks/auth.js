import * as authActions from "../redux/authentication/auth_actions";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import decode from 'jwt-decode'
export function useAuth() {
  const dispatch = useDispatch()
  const token = useSelector(state=>state.auth.token);
  const [isAuthenticated, setAuthenticated]  = useState(token !== null)

  useEffect(() => {
    console.log('User auth: ', token)
    if(!token)
    dispatch(authActions.checkAuthentication())    
    if (token)
    // check before get state.auth.token
    setAuthenticated(true);
  }, [])

  useEffect(() => {
    setAuthenticated(token !== null);
  }, [token])
  
  
  return [isAuthenticated,setAuthenticated];
}

export function useUserID(){
  const token = useSelector(state=>state.auth.token);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(decode(token).id)
  useEffect(() => {
    // check before get state.auth.token
    if (!token){
      dispatch(authActions.checkAuthentication())    
    }
    if(token){
      setUserId(decode(token).id)
    }
  }, [])

  
  useEffect(() => {
    if(token)
    setUserId(decode(token).id);
    else
    setUserId(null);
  }, [token])

  return [userId, setUserId];
}