import React, { Component } from 'react';

// material -ui
// this i can create my styles and put in the file i wanna
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typorgraphy from '@material-ui/core/Typography';

const styles ={
  card: {
    display: 'flex'
  }
}

export class Scream extends Component {
  render() {
    // here when you open in object the props you can use
    // the props inside then
    const { classes, scream : {
        body, 
        createAt, 
        userImage, 
        userHandle,
        screamId,
        likeCount,
        commentCount 
      }
    } = this.props;

    return (
      <Card>
        <CardMedia
          image={userImage} title="Profile image"
        />
        <CardContent>
          <Typorgraphy variant="h5">
            {userHandle}
          </Typorgraphy>
          <Typorgraphy variant="body2" color="textSecondary">
            {createAt}
          </Typorgraphy>
          <Typorgraphy variant="body1">
            {body}
          </Typorgraphy>
        </CardContent>
      </Card>
    )
  }
}

export default withStyles(styles)(Scream);
