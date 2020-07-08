// LYBRARY
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';
// redux
import { connect } from 'react-redux';

// material -ui
// this i can create my styles and put in the file i wanna
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// `icons
import ChatIcon from '@material-ui/icons/Chat';

const styles = {                                  
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

export class Scream extends Component {
  render() {
    dayjs.extend(relativeTime);
    // here when you open in object the props you can use
    // the props inside then
    const { classes, scream : {
        body, 
        createAt, 
        userImage, 
        userHandle,
        id,
        likeCount,
        commentCount 
      }, user: { authenticated, credentials: { handle } }
    } = this.props;
    // here just a conditons to show wich button depending the 
    // situation from the user, awalyus i wanna put some codition to show the 
    // i have to do it aboove the return
    
    const deleteButton = authenticated && userHandle === handle ? (
      <DeleteScream screamId={id} />
      // here i know that i will not put anything but now i know just
      // can i put null to when i wanna to put nothing to show the user
    ) : null
    return (
      <Card className={classes.card}>
        <CardMedia 
          image={userImage} 
          title="Profile image"
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography 
            variant="h5"
            component={Link}
            to={`/user/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createAt).fromNow()}
          </Typography>
          <Typography variant="body1">
            {body}
          </Typography>
          <LikeButton screamId={id} />
          <span>{likeCount} likes</span>
          <MyButton tip="Comments"><ChatIcon color="primary" /></MyButton>
          <span>{commentCount} comments</span>
          <ScreamDialog screamId={id} userHandle={userHandle} />
        </CardContent>
      </Card>
    )
  }
}

Scream.propTypes = {
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
  data: state.data
});

export default connect(mapStateToProps)(withStyles(styles)(Scream));
