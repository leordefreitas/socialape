// LIBRARYS
import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import PropTypes from 'prop-types';
// redux
import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';
// COMPONENTS
import Scream from '../components/scream/Scream';
import Profile from '../components/profile/Profile';

class home extends Component {

  // this is a example how to use the componentDidMount to
  // an information from the api i create
  componentDidMount() {
    this.props.getScreams();
  }
  render() { 
    const { screams, loading } = this.props.data;
    // this is to with have some scream will show if not
    // will show Loading
    let recentScreamsMarkup = !loading ? (
      screams.map(scream => <Scream scream={scream} key={scream.id}/>)  
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

home.propTypes = {
  getScreams: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data,
  user: state.user
});

export default connect(mapStateToProps, { getScreams })(home);
