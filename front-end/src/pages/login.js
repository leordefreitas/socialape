// LYBRARY
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import { Link } from 'react-router-dom';
import themeFile from '../util/theme';

// redux
// `this serve to connect to the page i want the information directly
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

// material ui
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = themeFile;

export class login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }
  // when i wanna to put in state something is a props i
  // have to use the follow code
  componentWillReceiveProps(nextProps) {
    if(nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  // to submit the form
  // the loading here is tru when the firebase are loading
  // in the end he became false again
  handleSubmit = (event) => {
    event.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    // here i go to use the loginUser the function i create in the
    // in the user actions, this.props.history is to me have acess
    // and change the page in the another code
    this.props.loginUser(userData, this.props.history);

  };
  
  // to change any thing is writ in the form
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { classes, UI: { loading } } = this.props;
    const { errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img 
            src={AppIcon} 
            alt="mokey"
            className={classes.image}
          />
          <Typography 
            variant="h2" 
            className={classes.pageTitle}
          >Login</Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField 
              id="email"
              name="email"
              type="email"
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              label="Email"
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField 
              id="password"
              name="password"
              type="password"
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              label="Password"
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />
            {errors.general && (
              <Typography 
                variant="body2" 
                className={classes.customError}
              >{errors.general}</Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={loading}
            >
              Login
              {loading && (
                <CircularProgress 
                  className={classes.progress} 
                  size={30}
                />
              )}
            </Button>
            <br />
            <small>
              don`t have an account ? signup <Link to='/signup'>here</Link>
            </small>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    )
  }
}

// this i never see, they serve to you give the information
// about the props the script has
login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
}

// maps
// `mapsToState have the information i wanna to this page
// `mapActions have the functions actions i will use i this app
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  loginUser
}

// this is when we use connect so just in the redux files
export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login))
