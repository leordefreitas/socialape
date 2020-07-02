import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// material -ui
// this i can create my styles and put in the file i wanna
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles ={
  card: {
    display: 'flex',
    margimBottom: 20,
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25
  }
}

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
        // screamId,
        // likeCount,
        // commentCount 
      }
    } = this.props;

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
          <Typography variant="body2" color="textSecondary">
            {dayjs(createAt).fromNow()}
          </Typography>
          <Typography variant="body1">
            {body}
          </Typography>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(Scream);
