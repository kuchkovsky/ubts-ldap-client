import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Form from '../containers/Form'
import { withStyles } from '@material-ui/core/styles';
import CredentialsContainer from './CredentialsContainer';
import { EDITOR_MODES, SUBMIT_STATUSES } from '../actions/content';

const styles = {
  content: {
    padding: 10,
    width: '100%',
    maxWidth: 1000,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  paper: {
    padding: 10,
  },
  submitStatus: {
    marginTop: 10,
  },
  textHint: {
    marginTop: 6,
    marginRight: 5,
  }
};

const Content = props => {
  const { classes, editorMode, submitStatusText, credentials } = props;
  return (
    <div className={classes.content}>
      <Paper className={classes.paper}>
        <Grid container justify="center">
          <Typography variant="subtitle2">
            {props.statusText}
          </Typography>
        </Grid>
        <Form {...props}/>
        <Grid container justify="center" align="center" direction="column" className={classes.submitStatus}>
          <Typography variant="subtitle2">
            {props.submitStatusText}
          </Typography>
        </Grid>
        {
          editorMode === EDITOR_MODES.INITIAL && submitStatusText === SUBMIT_STATUSES.SUCCESS &&
            <CredentialsContainer login={credentials.login} password={credentials.password}/>
        }
      </Paper>
    </div>
  )
};

Content.propTypes = {
  classes: PropTypes.object.isRequired,
  statusText: PropTypes.string.isRequired,
  editorMode: PropTypes.string.isRequired,
  submitStatusText: PropTypes.string.isRequired,
  credentials: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(Content);
