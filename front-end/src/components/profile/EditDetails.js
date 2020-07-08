// LIBRARY
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import themeFile from '../../util/theme';
import { editUserDetails } from '../../redux/actions/userActions';
import MyButton from '../../util/MyButton';
// material ui
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
// `icons
import EditIcon from '@material-ui/icons/Edit';
// redux
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';


const styles = themeFile;

export class EditDetails extends Component {
  state = {
    bio: '',
    location: '',
    website: '',
    open: false
  };
  // this function just take the information and pass to the state
  mapUserDetailsToState = (credentials) => {
    this.setState({
      bio: credentials.bio ? credentials.bio : '',
      location: credentials.location ? credentials.location : '',
      website: credentials.website ? credentials.website : '',
    })
  };
  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      location: this.state.location,
      website: this.state.website,
    }
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };
  handleOpen = () => {
    const { credentials } = this.props;
    this.setState({ open: true });
    this.mapUserDetailsToState(credentials);
  };
  handleClose = () => {
    const { credentials } = this.props;
    this.setState({ open: false });
    this.mapUserDetailsToState(credentials);
  };
  // this is used when i wanna do something in some time so when
  // component munt they will automaticlay do this
  componentDidMount() {
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton
          tip="Edit profile"
          onClick={this.handleOpen}
          btnClassName={classes.button}
          placement="top"
        >
          <EditIcon color="primary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                type="text"
                label="Location"
                placeholder="Where you live"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Your website"
                className={classes.textField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  }
}

EditDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  credentials: state.user.credentials
});

const mapActionsToProps = {
  editUserDetails
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditDetails));
