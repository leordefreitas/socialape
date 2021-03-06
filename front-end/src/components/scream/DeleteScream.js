// LYBRARY
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
// redux
import { connect } from 'react-redux';
import { deleteScream } from '../../redux/actions/dataActions';
// material ui
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
// `icons
import DeleteOutline from '@material-ui/icons/DeleteOutline';

const styles = {
  deleteButton: {
    position: 'absolute',
    left: '80%',
    top: '10%'
  }
};

export class DeleteScream extends Component {
  state = {
    open: false
  }
// this is just to the dialog 
  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  // to delete the scream
  deleteScream = () => {
    this.props.deleteScream(this.props.screamId);
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <MyButton 
          tip="Delete Scream" 
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color="secondary" />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            Are you sure you want to delete this scream ?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
            >Cancel</Button>
            <Button
              onClick={this.deleteScream}
              color="secondary"
            >Delete</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  }
}

DeleteScream.propTypes = {
  deleteScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
}

// null to if is not to be pass by state from redux, so i can just put nothing
// as null
export default connect(null, { deleteScream })(withStyles(styles)(DeleteScream));
