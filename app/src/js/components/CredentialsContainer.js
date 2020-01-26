import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
  <Grid container spacing={2} justify="center" className={props.classes.root}>
    <Grid item>
      <Grid container>
        <Grid item>
          <Typography className={props.classes.textHint} variant="subtitle2">
            Логін:
          </Typography>
        </Grid>
        <Grid item>
          <TextToClipboard text={props.login}/>
        </Grid>
      </Grid>
    </Grid>
    <Grid item>
      <Grid container>
        <Grid item>
          <Typography className={props.classes.textHint} variant="subtitle2">
            Пароль:
          </Typography>
        </Grid>
        <Grid item>
          <TextToClipboard text={props.password}/>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
);

CredentialsContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.string,
  password: PropTypes.string,
};

export default withStyles(styles)(CredentialsContainer);
