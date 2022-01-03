import React, { createContext, useState } from "react";

const authContext = createContext();

function useAuth() {
  const reduxProps = useSelector(state=>({
    isAuthenticated: (state.user.token!=null)? true:false
  }), shallowEqual);

  const dispatch = useDispatch()

  return {
    isAuthenticated,
    tryAutoSignIn=  ()=>{
        dispatch(authActions.checkAuthentication())
    },
  };
}
export function AuthProvider({ children }) {
    const auth = useAuth();
  
    return (
      <authContext.Provider value={auth}>
        {children}
      </authContext.Provider>
    );
  }
  
  export default function AuthConsumer() {
    return React.useContext(authContext);
  }