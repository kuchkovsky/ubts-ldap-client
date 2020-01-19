import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
});

const AppToolbar = ({ classes }) => (
  <AppBar position="static" className={classes.root}>
    <Toolbar>
      <Typography variant="h6" color="inherit" className={classes.grow}>
        UBTS LDAP Client
      </Typography>
    </Toolbar>
  </AppBar>
);

AppToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppToolbar);
