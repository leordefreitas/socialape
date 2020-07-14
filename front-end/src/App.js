// LIBRARYS
import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';
// redux
// `to connect the redux with the react
import { Provider } from 'react-redux';
import store from './redux//reducers/store';
import { SET_AUTHENTICATED } from './redux/reducers/types';
import { logoutUser, getUserData } from './redux/actions/userActions';

// PAGES
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';
import user from './pages/user';

// COMPONENTS
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute';

// MATERIAL-UI
// `this is here becouse all pages will have
// `the same theme, all this is in the website
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import axios from 'axios';

// using theme
const theme = createMuiTheme(themeFile);

// decoding the token
// `localStorage can be like that becouse i can acces the FB
// `* 1000 becouse is seconds so to be in the same order
// `window locatioon is to redirect the user to the new page
const token = localStorage.FBIdToken;
if(token) {
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()) {
    // to change th state i can call store and use the redux
    // dispatch to call an actions function
    store.dispatch(logoutUser());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    // this is used to not the page change i lose the 
    // authorizations header
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
};

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <Navbar/>
            <div className="container">
              <Switch>
                <Route exact path="/" component={home}/>
                <AuthRoute exact path="/login" component={login} />
                <AuthRoute exact path="/signup" component={signup} />
                <Route exact path="/user/:handle" component={user} />
              </Switch>
            </div>
            </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
