// LYBRARY
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.png';
import axios from 'axios';
import { Link } from 'react-router-dom';

// material ui
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = {
  form: {
    textAlign: 'center'
  },
  image: {
    margin: '20px auto 10px auto',
  },
  pageTitle: {
    margin: '10px auto 5px auto',
  },
  textField: {
    margin: '10px auto 10px auto',
  },
  button: {
    margin: '10px auto 10px auto',
    position: "relative"
  },
  customError: {
    color: 'red',
    fontSize: '0.8rem',
    marginTop: 10
  },
  progress: {
    position: "absolute",
  }
}

export class login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
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
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    // i have to pass the information here inside the post
    axios.post('/login', userData)
      .then(res => {
        console.log(res.data);
        this.setState({
          loading: false
        });
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
              type="text"
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
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(login)
