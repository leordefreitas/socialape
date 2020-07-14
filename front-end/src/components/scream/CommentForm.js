// LYBRARY
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import themeFile from '../../util/theme';
// material ui
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// redux
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = themeFile;

export class CommentForm extends Component {
  state = {
    body: '',
    errors: {}
  }

  // to deal with the errors in the forms, is better i use this
  // thing bellow becouse i can handle the errors after the submit
  // this is very good to show the errors for the user
  componentWillReceiveProps(nextProps) {
    if(nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    };
    if(!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '' });
    };
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };
  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitComment(
      this.props.screamId,
      { body: this.state.body }
    )
  };
  render() {
    const { classes, authenticated } = this.props;
    const { errors } = this.state;

    const commentFormMarkup = authenticated ? (
      <Grid item sm={10} style={{ textAlign: 'center' }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Comment on scream"
            // here we got to erro sho in the scream and give that style
            // i wnat
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
          >Submit</Button>
        </form>
        <hr className={classes.visibleSeparator} />
      </Grid>
    ) : null;

    return  commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  screamId: PropTypes.string.isRequired,
  UI: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));
