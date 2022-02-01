import * as authActions from "../redux/authentication/auth_actions";
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

export default function useAuth() {
  const reduxProps = useSelector(state=>({
    isAuthenticated: (state.auth.token!=null)? true:false
  }), shallowEqual);

  const dispatch = useDispatch()

  return {
    isAuthenticated: reduxProps.isAuthenticated,
    tryAutoSignIn: ()=>{
      dispatch(authActions.checkAuthentication())
    }
  };
}

