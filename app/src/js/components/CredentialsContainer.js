import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextToClipboard from './shared/TextToClipboard';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    marginTop: 10,
  },
  textHint: {
    marginTop: 6,
    marginRight: 5,
  }
};

const CredentialsContainer = props => (
  <Grid container justify="center" className={props.classes.root}>
    <div>
      <TextToClipboard text={`Логін: ${props.login} Пароль: ${props.password}`}/>
    </div>
  </Grid>
);

CredentialsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.string,
  password: PropTypes.string,
};

export default withStyles(styles)(CredentialsContainer);
