// LIBRARY
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
// material ui
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// redux
import { connect } from 'react-redux';


const styles = {
  invisleSeparator: {
    border:'none',
    margin: 4
  },
  visibleSeparator: {
    width: '100%',
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    marginBottom: 20
  },
  commentImage: {
    maxWidth: '100%',
    height: 100,
    objectFit: 'cover',
    borderRadius: '50%'
  },
  commentData: {
    marginLeft: 20
  }
}

class Comments extends Component {
  render() {
    const { comments, classes } = this.props;
    return (
      <Grid container>
      {/* {comments === {} ? null : (
        <Fragment> */}
          {/* i have acess to the index so i can use
          to only print the hr that i wanna */}
          {comments === undefined ? (<div></div>) : (
            comments.map((comment, index) => {
              // i can do this becouse comment is an object so i can
              // destructure to each cons i wanna
              const { body, createAt, userImage, userHandle } = comment;
              return (
                // awalys do map create much peace diferents put
                // a key if note the script give me warning
                <Fragment key={createAt}>
                  <Grid item sm={12}>
                    <Grid container>
                      <Grid item sm={2}>
                        <img src={userImage} alt="comment" className={classes.commentImage} />
                      </Grid>
                      <Grid item sm={9}>
                        <div className={classes.commentData}>
                          <Typography
                            variant="h5"
                            component={Link}
                            to={`/users/${userHandle}`}
                            color="primary"
                          >{userHandle}</Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                          >{dayjs(createAt).format('h:mm a, MMMM DD YYYY')}</Typography>
                          <hr className={classes.invisleSeparator} />
                          <Typography
                            variant="body1"
                          >{body}</Typography>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {index !== comments.length - 1 && (
                    <hr className={classes.visibleSeparator} />
                  )}
                </Fragment>
              )
            })
            ) 
          }
      </Grid>
    )
  }
}

Comments.propTypes = {
  comments: PropTypes.array.isRequired
}

const mapStateToProps = (state) => ({
  comments: state.data.scream.comments
});

export default connect(mapStateToProps)(withStyles(styles)(Comments));