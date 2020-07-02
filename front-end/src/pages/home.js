// LIBRARYS
import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import axios from 'axios';

// COMPONENTS
import Scream from '../components/Scream';
import Profile from '../components/Profile';

class home extends Component {
  // state
  state = {
    screams: null
  }
  // this is a example how to use the componentDidMount to
  // an information from the api i create
  componentDidMount() {
    axios.get('/screams')
      .then(res => {
        // console.log(res.data);
        this.setState({
          screams: res.data
        })
      })
      .catch(err => console.error(err));
  }
  render() {
    // this is to with have some scream will show if not
    // will show Loading
    let recentScreamsMarkup = this.state.screams ? (
      this.state.screams.map(scream => <Scream scream={scream} key={scream.id}/>)  
    ) : <span>Loading...</span>

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          <div>{recentScreamsMarkup}</div>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    )
  }
}

export default home
