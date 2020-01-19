import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  textContainer: {
    padding: 4,
    border: '2px solid rgba(121, 85, 72, 0.5)',
    borderRadius: 5,
    marginRight: 2,
  },
  text: {
    color: 'black',
  },
};

const TextToClipboard = ({ classes, text }) => {
  const [copied, setCopied] = useState(false);
  return (
    <Grid container>
      <Grid item className={classes.textContainer}>
        { text }
      </Grid>
      <Grid item>
        <CopyToClipboard text={text} onCopy={() => setCopied(true)}>
          <Button variant="outlined" color="primary">
            Копіювати
          </Button>
        </CopyToClipboard>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
        message={<span>Скопіювано!</span>}
      />
    </Grid>
  );
};

TextToClipboard.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

export default withStyles(styles)(TextToClipboard);
