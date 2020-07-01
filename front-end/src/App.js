// LIBRARYS
import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import themeFile from './util/theme';
import jwtDecode from 'jwt-decode';

// PAGES
import home from './pages/home';
import login from './pages/login';
import signup from './pages/signup';

// COMPONENTS
import Navbar from './components/Navbar';
import AuthRoute from './util/AuthRoute';

// material-ui
// `this is here becouse all pages will have
// `the same theme, all this is in the website
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

// using theme
const theme = createMuiTheme(themeFile);

// decoding the token
// `localStorage can be like that becouse i can acces the FB
// `* 1000 becouse is seconds so to be in the same order
// `window locatioon is to redirect the user to the new page
const token = localStorage.FBIdtoken;
let authenticated;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = '/login'
    authenticated = false;
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <Navbar/>
            <div className="container">
              <Switch>
                <Route exact path="/" component={home}/>
                <AuthRoute exact path="/login" component={login} authenticated={authenticated} />
                <AuthRoute exact path="/signup" component={signup} authenticated={authenticated} />
              </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
