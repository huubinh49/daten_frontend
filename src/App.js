import './App.scss';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import React from 'react'
import routes from './pages/routes';

function App() {
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
