import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import {languages as languagesData} from 'country-data'
import deburr from 'lodash/deburr';
import validator from 'validator';

const languageLevels = [
  { value: 'none', label: 'None' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const languages = languagesData.all.filter(word => !(/\d/.test(word.name)))

const getSuggestions = value => {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0 ? [] : languages.filter(language => {
    const keep = count < 5 && language.name.slice(0, inputLength).toLowerCase() === inputValue;
    
    if (keep) {
      count++;
    }

    return keep;
  });
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = (suggestion, { query, isHighlighted }) => {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
};

const renderInputComponent = inputProps => {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
};

const langObject = { name: '', writingLevel: '', speakingLevel: '' };

const styles = theme => ({
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  row: {
    display: 'inline-block'
  },
  button: {
    margin: theme.spacing.unit,
  },
  select: {
    textAlign: 'left'
  }
});
class LanguageInfo extends Component {
  state = {
    suggestions: [],
    languagesError: [],
    writingLevelError: '',
    speakingLevelError: '',
    motherTongueError: '',
  }

  validate = () => {
    let isError = false;
    const errors = {
      languagesError: [],
      writingLevelError: '',
      speakingLevelError: '',
      motherTongueError: '',
    };

    if (validator.isEmpty(this.props.motherTongue)) {
      errors.motherTongueError = "Mother tongue is required";
      isError = true
    } else if (!validator.isAlpha(this.props.motherTongue)) {
      errors.motherTongueError = "Mother tongue is not valid"
      isError = true
    }

    if (validator.isEmpty(this.props.writingLevel)) {
      errors.writingLevelError = "Writing level is required";
      isError = true
    } 

    if (validator.isEmpty(this.props.speakingLevel)) {
      errors.speakingLevelError = "Speaking level is required";
      isError = true
    } 

    this.props.languages.forEach((language, index) => {
      errors.languagesError = errors.languagesError.concat([JSON.parse(JSON.stringify(langObject))]);
      if (validator.isEmpty(language.name)) {
        errors.languagesError[index].name = "Language name is required";
        isError = true
      } else if (!validator.isAlpha(language.name)) {
        errors.languagesError[index].name = "Language name is not valid"
        isError = true
      }
      if (validator.isEmpty(language.writingLevel)) {
        errors.languagesError[index].writingLevel = "Writing level is required";
        isError = true
      } 
  
      if (validator.isEmpty(language.speakingLevel)) {
        errors.languagesError[index].speakingLevel = "Speaking level is required";
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

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { classes } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    const handleChange = this.props.handleChange;
    const handleAutoSuggestChange = this.props.handleAutoSuggestChange;
    const handleAddObject= this.props.handleAddObject;
    const handleRemoveObject= this.props.handleRemoveObject;
    const handleEditObjectAutosuggest= this.props.handleEditObjectAutosuggest;
    const handleEditObject= this.props.handleEditObject;
    const languages = this.props.languages;
    const writingLevel = this.props.writingLevel;
    const speakingLevel = this.props.speakingLevel;
    const motherTongue = this.props.motherTongue;

    return (
      <React.Fragment>
      <Typography variant="title" gutterBottom>
      Language Information
      </Typography>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={4}>
          <Autosuggest
            {...autosuggestProps}
            inputProps={{
              classes,
              label: 'Mother Tongue',
              value: motherTongue,
              onChange: handleAutoSuggestChange('motherTongue'),
              helperText: this.state.motherTongueError,
              error: this.state.motherTongueError.length > 0,
            }}
            theme={{
              container: classes.container,
              suggestionsContainerOpen: classes.suggestionsContainerOpen,
              suggestionsList: classes.suggestionsList,
              suggestion: classes.suggestion,
            }}
            renderSuggestionsContainer={options => (
              <Paper {...options.containerProps} square>
                {options.children}
              </Paper>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id="writingLevel"
            name="writingLevel"
            select
            label="Writing Level"
            value={writingLevel}
            onChange={event => handleChange(event)}
            fullWidth
            className={classes.select}
            helperText={this.state.writingLevelError}
            error={this.state.writingLevelError.length > 0}
          >
            {languageLevels.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            id="speakingLevel"
            name="speakingLevel"
            select
            label="Speaking Level"
            value={speakingLevel}
            onChange={event => handleChange(event)}
            className={classes.select}
            fullWidth
            helperText={this.state.speakingLevelError}
            error={this.state.speakingLevelError.length > 0}
          >
            {languageLevels.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subheading" gutterBottom className={classes.row}>
          Add another language
          </Typography>
          <Button variant="fab" mini color="secondary" 
                  aria-label="Add" 
                  onClick={event => handleAddObject("languages", langObject)}
                  className={classes.button}>
            <AddIcon />
          </Button>
        </Grid>
        {languages.map((language, index) => (
          <React.Fragment key={index}>
          <Grid container spacing={24} item xs={12} sm={11}>
            <Grid item xs={12} sm={4}>
              <Autosuggest
                  {...autosuggestProps}
                  inputProps={{
                    classes,
                    value: language.name,
                    label: "Language",
                    onChange: handleEditObjectAutosuggest("languages", "name", index),
                    helperText: this.objectErrorText("languagesError", index, "name"),
                    error: this.objectErrorText("languagesError", index, "name").length > 0,
                  }}
                  theme={{
                    container: classes.container,
                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                    suggestionsList: classes.suggestionsList,
                    suggestion: classes.suggestion,
                  }}
                  renderSuggestionsContainer={options => (
                    <Paper {...options.containerProps} square>
                      {options.children}
                    </Paper>
                  )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="writingLevel"
                name="writingLevel"
                select
                label="Writing Level"
                value={language.writingLevel}
                onChange={handleEditObject("languages", index)}
                className={classes.select}
                fullWidth
                helperText={this.objectErrorText("languagesError", index, "writingLevel")}
                error={this.objectErrorText("languagesError", index, "writingLevel").length > 0}
              >
                {languageLevels.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="speakingLevel"
                name="speakingLevel"
                select
                label="Speaking Level"
                value={language.speakingLevel}
                onChange={handleEditObject("languages", index)}
                className={classes.select}
                fullWidth
                helperText={this.objectErrorText("languagesError", index, "speakingLevel")}
                error={this.objectErrorText("languagesError", index, "speakingLevel").length > 0}
              >
                {languageLevels.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={1}>
          <Button variant="fab" mini aria-label="Delete" 
                  onClick={(event) => handleRemoveObject("languages", index, event)}
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

LanguageInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LanguageInfo);