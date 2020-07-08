// LYBRARY
import React, { Component } from 'react'
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// material ui
import withStyles from '@material-ui/core/styles/withStyles';
// `icons
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
// redux
import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../../redux/actions/dataActions';

const styles = theme => ({
});
export class LikeButton extends Component {
  // to user like the scream or not to me have the sure
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(
        (like) => like.screamId === this.props.screamId
      )
    ) return true;
    else return false;
  };
  // this just to make the function to call the like and unlike actiosn
  // and be more easy in the script
  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
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
      return likeButton;
    }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapActionToProps = {
  likeScream,
  unlikeScream
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(LikeButton));
