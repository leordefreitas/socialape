// LYBRARY
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import themeFile from '../util/theme';

// material ui
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// i can just take what is in other theme in the app page
const styles = themeFile;

export class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      handle: '',
      whatsapp: '',
      name: '',
      loading: false,
      errors: {}
    }
  }
  // to submit the form
  // the loading here is tru when the firebase are loading
  // in the end he became false again
  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle,
      whatsapp: this.state.whatsapp,
      name: this.state.name
    };
    // i have to pass the information here inside the post
    axios.post('/signup', newUserData)
      .then(res => {
        // console.log(res.data);
        localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        // this is to move into thata direction
        this.props.history.push('/');
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          loading: false
        })
      })
  };
  
  // to change any thing is writ in the form
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    const { classes } = this.props;
    const { errors, loading } = this.state;
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
          >Signup</Typography>
          <form noValidate onSubmit={this.handleSubmit}>
          <TextField 
              id="name"
              name="name"
              type="text"
              className={classes.textField}
              helperText={errors.name}
              error={errors.name ? true : false}
              label="Full Name"
              value={this.state.name}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField 
              id="handle"
              name="handle"
              type="text"
              className={classes.textField}
              helperText={errors.handle}
              error={errors.handle ? true : false}
              label="Handle"
              value={this.state.handle}
              onChange={this.handleChange}
              fullWidth
            />
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
            <TextField 
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={classes.textField}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              label="Confirm Password"
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField 
              id="whatsapp"
              name="whatsapp"
              type="number"
              className={classes.textField}
              helperText={errors.whatsapp}
              error={errors.whatsapp ? true : false}
              label="WhatsApp"
              value={this.state.whatsapp}
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
              Signup
              {loading && (
                <CircularProgress 
                  className={classes.progress} 
                  size={30}
                />
              )}
            </Button>
            <br />
            <small>
              Already have an account ? login <Link to='/login'>here</Link>
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
signup.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(signup)
