// LYBRARY
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// material ui
import withStyles from '@material-ui/core/styles/withStyles';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import themeFile from '../../util/theme';
// `icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';

const styles = themeFile;

const StaticProfile = (props) => {
  const { classes, profile: {
    handle,
    createAt,
    imageUrl,
    bio,
    website,
    location
  } } = props;

  return (
    <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageUrl} alt="profile" className="profile-image"/>
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
        </div>
      </Paper>    
  )
};

StaticProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

export default withStyles(styles)(StaticProfile);