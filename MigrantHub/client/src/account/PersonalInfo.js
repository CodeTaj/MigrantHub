import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import FormComponent from './FormComponent'
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const status = [
  { value: 'immigrant', label: 'Immigrant' },
  { value: 'refugee', label: 'Refugee' },
  { value: 'resident', label: 'Permanent Resident' },
  { value: 'citizen', label: 'Citizen' }
];

const gender = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
    flexDirection: 'row'
  },
  label: {
    flexDirection: 'row'
  }
});

class PersonalInfo extends FormComponent {
  state = {
    age: '',
    gender: '',
    nationality: '',
    status: ''
  }

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
      <Typography variant="title" gutterBottom>
        Personal Information
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={6}>
          <TextField 
            id="age"
            name="age"
            label="Age"
            value={this.state.age}
            onChange={ event => this.handleChange(event)}
            fullWidth
            InputProps={{
              endAdornment: <InputAdornment position="end">years</InputAdornment>
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="nationality" 
            name="nationality"
            label="Nationality"
            value={this.state.nationality}
            onChange={ event => this.handleChange(event)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="status"
            name="status"
            select
            label="Status"
            value={this.state.status}
            onChange={event => this.handleChange(event)}
            helperText="Please select a status"
            fullWidth
          >
            {status.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-label="Gender"
              id="gender"
              name="gender"
              className={classes.group}
              value={this.state.gender}
              onChange={ event => this.handleChange(event)}
            >
              {gender.map(option => (
                <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label}>
                  {option.label}
                </FormControlLabel>
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      </React.Fragment>
    );
  }
}

PersonalInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PersonalInfo);
