import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

function TimePickers(props) {
  const { classes } = props;
  let date = new Date()
  let time = (date).toTimeString().split(' ')[0].split(':')
  return (
    <form className={classes.container} noValidate>
      <TextField
        id="newTime"
        label="Time"
        type="time"
        defaultValue={time[0]+':'+time[1]}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          step: 60,
        }}
      />
    </form>
  );
}

TimePickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TimePickers);