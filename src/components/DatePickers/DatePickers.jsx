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
  let date = (new Date()).toLocaleDateString().split('/')
  let dateStr = date[2]+'-'+(date[0].length>1?date[0]:('0'+date[0]))+'-'+(date[1].length>1?date[1]:('0'+date[1]))
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