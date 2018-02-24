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

function DatePickers(props) {
  const { classes } = props;
  let date = new Date()
  let dateStr = date.getFullYear()+'-'+(date.getMonth()>8?(date.getMonth()+1):('0'+(date.getMonth()+1)))+'-'+(date.getDate()>8?(date.getDate()+1):('0'+(date.getDate()+1)))
  console.log(dateStr)
  return (
    <form className={classes.container} noValidate>
      <TextField
        id="newDate"
        label="Date(Month/Date/Year)"
        type="date"
        defaultValue={dateStr}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </form>
  );
}

DatePickers.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DatePickers);