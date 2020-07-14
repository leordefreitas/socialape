import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

AuthRoute.propTypes = {
  user: PropTypes.object
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
  user: state.user
});

export default connect(mapStateToProps)(AuthRoute);
