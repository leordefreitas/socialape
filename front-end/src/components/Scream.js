// LYBRARY
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';
import MyButton from '../util/MyButton';
// redux
import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../redux/actions/dataActions';
// material -ui
// this i can create my styles and put in the file i wanna
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
// `icons
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

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
  // to user like the scream or not to me have the sure
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.scream.id
      )
    ) return true;
    else return false;
  };
  // this just to make the function to call the like and unlike actiosn
  // and be more easy in the script
  likeScream = () => {
    this.props.likeScream(this.props.scream.id);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.scream.id);
  };
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
      }, user: { authenticated }
    } = this.props;
    // here just a conditons to show wich button depending the 
    // situation from the user, awalyus i wanna put some codition to show the 
    // i have to do it aboove the return
    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorder color="primary" />
        </Link>
      </MyButton>
    ) : (
      this.likedScream() ? (
        <MyButton tip="Undo Like" onClick={this.unlikeScream}>
          <FavoriteIcon color="primary" />
        </MyButton>
      ) : (
        <MyButton tip="Like" onClick={this.likeScream}>
          <FavoriteBorder color="primary" />
        </MyButton>
      )
    )
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
          <span>{likeButton} {likeCount} Likes</span>
          <MyButton tip="Comments"><ChatIcon color="primary" /></MyButton>
          <span>{commentCount} comments</span>
        </CardContent>
      </Card>
    )
  }
}

Scream.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  scream: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionsToProps = {
  likeScream,
  unlikeScream
}

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Scream));
