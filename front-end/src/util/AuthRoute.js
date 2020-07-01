import React from 'react';
import { Route, Redirect } from 'react-router-dom';

// redirect the aplication
// `so n when is have a valid toke the user is redirect to this page
// `when he is login he see something when he is not he see another
const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) => 
      authenticated === true ? <Redirect to="/" /> : <Component {...props} />
    }
  />
);

export default AuthRoute;
