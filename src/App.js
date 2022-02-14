import './App.scss';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import React, { useEffect } from 'react'
import routes from './pages/routes';
import { useDispatch } from 'react-redux';
import * as authActions from "./redux/authentication/auth_actions";

function App() {
  
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(authActions.checkAuthentication())
  }, [])
  
  return (
    <Routes>
      {
        routes.map(({component: Component, path, ...rest}) => {
          return <Route element = {
              <React.Suspense fallback = {"loading..."}>
                <Component />
              </React.Suspense>
          } path={path} key={path} {...rest} />;
        })
      }
    </Routes>
  );
}

export default App;
