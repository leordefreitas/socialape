// LYBRARY
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Scream from '../components/scream/Scream';
import StaticProfile from '../components/profile/StaticProfile';
// material ui
import Grid from '@material-ui/core/Grid';
// redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

export class user extends Component {
  state = {
    profile: null
  }
  // this is use to in the first thing that will do when opens
  componentDidMount() {
    // this is used to match the params that i pass in the url
    // so the paramas inside the url will be the esame that const i
    // declare here
    const handle = this.props.match.params.handle;
    this.props.getUserData(handle);
    axios.get(`/user/${handle}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => console.error(err))
  }
  render() {
    const { screams, loading } = this.props.data;
    const screamsMarkup = loading ? (
      <p>Loading data ...</p>
    ) : screams === null ? (
      <p>No screams from this user</p>
      ) : (
        screams.map(scream => <Scream id={scream.screamId} scream={scream} />)
    )

    return (
     <Fragment>
       <Grid container spacing={10}>
         <Grid item sm={8} xs={10}>
           {screamsMarkup}
         </Grid>
         <Grid item sm={4} xs={10}>
           {this.state.profile === null ? (<p>Loading profile ...</p>) : (
             <StaticProfile profile={this.state.profile} />
           )}
         </Grid>
       </Grid>
     </Fragment>
    )
  }
}

user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  data: state.data
});

export default connect(mapStateToProps, { getUserData })(user);
