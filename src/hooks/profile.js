import * as datingActions from "../redux/dating/dating_actions";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useUserID } from "./auth";
import { useEffect } from "react";
import profileAPI from "../api/profileAPI";

export default function useProfile() {
    const profile = useSelector(state=> state.dating.profile);
    const [userId, setUserId] = useUserID();
    const getNewProfile = async () => {
      try{
        if(userId && (!profile || profile == 'undefined' || !Object.keys(profile).length)){
          const res = await profileAPI.get(userId);
          setProfile(res.profile);
        }
      }catch(error){
        console.log(error)
      }
      
    }
    useEffect(() => {
       getNewProfile();
    }, [userId])
    useEffect(() => {
      getNewProfile();
   }, [])
    
    const dispatch = useDispatch()
    const setProfile = (newProfile)=>{
      dispatch(datingActions.updateProfile(newProfile))
    }
    return [profile,setProfile];
  }