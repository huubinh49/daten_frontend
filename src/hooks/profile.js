import * as datingActions from "../redux/dating/dating_actions";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

export default function useProfile() {
    const reduxProps = useSelector(state=>({
      profile: state.dating.profile
    }));
  
    const dispatch = useDispatch()
    const setProfile = (newProfile)=>{
      dispatch(datingActions.updateProfile(newProfile))
    }
    return [
      reduxProps.profile,
      setProfile
    ];
  }