// LIBRARY
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';
import MyButton  from '../util/MyButton';
// redux
import { connect } from 'react-redux';
import { logoutUser, uploadImage } from '../redux/actions/userActions';
// material ui
import themeFile from '../util/theme';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
// `icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

// styles that i save all in this file
const styles = themeFile;

export class Profile extends Component {
  // to import some imgae to the user event
  handleImageChange = (event) => {
    // this is becouse the type of the input is file so
    // when he got the files only the first will be charge
    // if not put [0] will bug the code
    const image = event.target.files[0];
    // send image to firebase, so formData() never use but
    // i think is just to create a new data format 
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };
  // this is to activate the handleImageChange becouse they 
  // will not have a button so to activate then we need do this
  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    // i can use this function to do things that i don`t need
    // the user to click
    fileInput.click();
  };
  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const { classes, user: { authenticated, loading, credentials: { 
      handle,
      createAt,
      bio,
      website,
      location,
      imageUrl,
     } } } = this.props;

  // now is a bit cofunsing but is just to options that to show
  // to the user so if the user is loading or login
    let profileMarkup = !loading ? (authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image"/>
            <input 
              type="file" 
              id="imageInput" 
              onChange={this.handleImageChange} 
              hidden="hidden"
            />
            <MyButton 
              tip="Edit profile picture"
              onClick={this.handleEditPicture}
              btnClassName="button"
              placement="top"
            >
              <EditIcon color="primary" />
            </MyButton>
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink 
              component={Link} 
              to={`/user/${handle}`}
              variant="h5"
              color="primary"
            >@{handle}</MuiLink>  
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (
              <Fragment>
                <LocationOn color="primary" /> 
                <span>{location}</span>
                <hr />
              </Fragment>
            )}
            {website && (
              <Fragment>
                <LinkIcon color="primary" />
                <a href={website} target="_blank" rel="noopener noreferrer">
                  {' '}{website}
                </a>
                <hr />
              </Fragment>
            )}
            <CalendarToday color="primary" />
            <span>Joined {dayjs(createAt).format('MMM YYYY')}</span>
          </div>
          <MyButton 
              tip="Logout"
              onClick={this.handleLogout}
              placement="top"
            >
              <KeyboardReturn color="primary" />
            </MyButton>
          <EditDetails />
        </div>
      </Paper>    
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No profile found, please login again
        </Typography>
        <div className={classes.buttons}>
          <Button 
            variant="contained" 
            color="primary"
            component={Link}
            to="/login"
          >Login</Button>
          <Button 
            variant="contained" 
            color="secondary"
            component={Link}
            to="/signup"
          >Signup</Button>
        </div>
      </Paper>
    )) 
    
      : (<p>loading...</p>); 

    return profileMarkup;
  }
}

Profile.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user
});

const mapActionsToProps = {
  logoutUser,
  uploadImage
};


export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));
