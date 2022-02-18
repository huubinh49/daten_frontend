import * as datingActions from "../redux/dating/dating_actions";
import {
  useSelector,
  useDispatch
} from 'react-redux';
import {
  useUserID
} from "./auth";
import {
  useEffect,
  useState,
  useCallback
} from "react";
import profileAPI from "../api/profileAPI";

export default function useProfile() {
  const profileRedux = useSelector(state => state.dating.profile);
  const [userId, setUserId] = useUserID();
  const [profile, setProfile] = useState(profileRedux)
  const dispatch = useDispatch()

  const getProfile = useCallback(
    async () => {
      try {
        if (userId) {
          const res = await profileAPI.get(userId);
          setProfile(res.profile || {});
        }
      } catch (error) {
        console.log(error)
      }

    }, [userId])

  useEffect(() => {
    if (userId && (!profile || profile === 'undefined' || !Object.keys(profile).length)) {
      getProfile();
    }
  }, [])

  useEffect(() => {
    setProfileRedux(profile)
  }, [profile])


  const setProfileRedux = (newProfile) => {
    dispatch(datingActions.updateProfile(newProfile))
  }
  return [profile, setProfile];
}