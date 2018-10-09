import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import validator from 'validator';
import NumberFormat from 'react-number-format';

const jobStatuses = [
  { value: 'fulltime', label: 'Full Time' },
  { value: 'parttime', label: 'Part Time' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'student', label: 'Student' }
]

const lookingForJobOptions = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

const workObject = { title: '', company: '', years: '' };

const IncomeMask = (props) => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      onValueChange={values => {
        onChange({
            target: {
              name: props.name,
              value: values.value,
            },
        });
      }}
      thousandSeparator={true} 
      prefix={'$'}
    />
  );
}

const styles = theme => ({
  container: {
    position: 'relative',
  },
  row: {
    display: 'inline-block'
  },
  button: {
    margin: theme.spacing.unit,
  },
  group: {
    flexDirection: 'row'
  },
  formControl: {
    textAlign: 'left'
  },
  select: {
    textAlign: 'left'
  }
});
class EmploymentInfo extends Component {
  state = {
    jobStatusError: '',
    lookingForJobError: '',
    workExperienceError: [],
  }

  validate = () => {
    let isError = false;
    const errors = {
      jobStatusError: '',
      lookingForJobError: '',
      workExperienceError: [],
    };

    if (validator.isEmpty(this.props.jobStatus)) {
      errors.jobStatusError = "Job status is required";
      isError = true
    }

    if (validator.isEmpty(this.props.lookingForJob)) {
      errors.lookingForJobError = "This field is required";
      isError = true
    }

    this.props.workExperience.forEach((job, index) => {
      errors.workExperienceError = errors.workExperienceError.concat([JSON.parse(JSON.stringify(workObject))]);

      if (validator.isEmpty(job.title)) {
        errors.workExperienceError[index].title = "Title is required";
        isError = true
      } else if (!validator.isAlpha(job.title)) {
        errors.workExperienceError[index].title = "Title is not valid";
        isError = true
      } 

      if (validator.isEmpty(job.company)) {
        errors.workExperienceError[index].company = "Company is required";
        isError = true
      }

      if (validator.isEmpty(job.years)) {
        errors.workExperienceError[index].years = "Employment length is required";
        isError = true
      }
    });

    this.setState({
      ...this.state,
      ...errors
    })
    
    return isError;
  }

  objectErrorText = (name, index, field) => {
    return this.state[name][index] === undefined ? "" : this.state[name][index][field] 
  }

  render() {
    const { classes } = this.props;

    const handleChange = this.props.handleChange;
    const handleAddObject= this.props.handleAddObject;
    const handleRemoveObject= this.props.handleRemoveObject;
    const handleEditObject= this.props.handleEditObject;
    const jobStatus = this.props.jobStatus;
    const lookingForJob = this.props.lookingForJob;
    const currentIncome = this.props.currentIncome;
    const workExperience = this.props.workExperience;

    return (
      <React.Fragment>
      <Typography variant="title" gutterBottom>
        Employment Information
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={4}>
          <TextField
            name="jobStatus"
            select
            label="Job Status"
            value={jobStatus}
            onChange={event => handleChange(event)}
            className={classes.select}
            fullWidth
            helperText={this.state.jobStatusError}
            error={this.state.jobStatusError.length > 0}
          >
            {jobStatuses.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField 
              name="currentIncome"
              label="Current Income (Optional)"
              value={currentIncome}
              onChange={ event => handleChange(event)}
              fullWidth
              InputProps={{
                inputComponent: IncomeMask,
              }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset" fullWidth className={classes.formControl}>
            <FormLabel component="legend" error={this.state.lookingForJobError.length > 0}>Looking for a job?</FormLabel>
            <RadioGroup
              aria-label="Looking for a job?"
              id="lookingForJob"
              name="lookingForJob"
              className={classes.group}
              value={lookingForJob}
              onChange={ event => handleChange(event) }
            >
              {lookingForJobOptions.map(option => (
                <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label}>
                  {option.label}
                </FormControlLabel>
              ))}
            </RadioGroup>
            <FormHelperText
                error={this.state.lookingForJobError.length > 0}
              >
                {this.state.lookingForJobError}
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subheading" gutterBottom className={classes.row}>
          Add work experience
          </Typography>
          <Button variant="fab" mini color="secondary" 
                  aria-label="Add" 
                  onClick={event => handleAddObject("workExperience", workObject)}
                  className={classes.button}>
            <AddIcon />
          </Button>
        </Grid>
        {workExperience.map((work, index) => (
          <React.Fragment key={index}>
          <Grid container spacing={24} item xs={12} sm={11}>
            <Grid item xs={12} sm={4}>
              <TextField 
                id="title"
                name="title"
                label="Title"
                value={work.title}
                onChange={handleEditObject("workExperience", index)}
                helperText={this.objectErrorText("workExperienceError", index, "title")}
                error={this.objectErrorText("workExperienceError", index, "title").length > 0}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                id="company"
                name="company"
                label="Company"
                value={work.company}
                onChange={handleEditObject("workExperience", index)}
                helperText={this.objectErrorText("workExperienceError", index, "company")}
                error={this.objectErrorText("workExperienceError", index, "company").length > 0}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                id="years"
                name="years"
                label="Employment length"
                value={work.years}
                onChange={handleEditObject("workExperience", index)}
                helperText={this.objectErrorText("workExperienceError", index, "years")}
                error={this.objectErrorText("workExperienceError", index, "years").length > 0}
                fullWidth
                type="number"
                InputProps={{
                  endAdornment: <InputAdornment position="end">years</InputAdornment>
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={1}>
          <Button variant="fab" mini aria-label="Delete" 
                  onClick={(event) => handleRemoveObject("workExperience", index, event)}
                  className={classes.button}>
            <DeleteIcon />
          </Button>
          </Grid>
          </React.Fragment>
          ))}
      </Grid>    
      </React.Fragment>
    );
  }
}

EmploymentInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmploymentInfo);
