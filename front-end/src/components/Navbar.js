import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// MATERIAL-UI
// all this below is in the site of the materia-ui
// so any thing i wanna know just go to their site
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
// icons
import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';
// this is from util
import MyButton from '../util/MyButton';

export class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        {authenticated ? (
          <Fragment>
              <MyButton tip="Post a scream">
                <AddIcon color="primary" />
              </MyButton>
                <MyButton tip="Home">
                  <HomeIcon color="primary" />
                </MyButton>
              <MyButton tip="Notifications">
                <Notifications color="primary" />
              </MyButton>
          </Fragment>
        ) : (
          <Fragment>
            <Toolbar className="nav-container">
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/">Home</Button>
              <Button color="inherit" component={Link} to="/signup">Signup</Button>
            </Toolbar>
          </Fragment>
        )}
        
      </AppBar>
    )
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired
}

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated
}); 

export default connect(mapStateToProps)(Navbar);
