import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { renderInputComponent } from 'helpers/Autosuggest';

const styles = theme => ({
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 999,
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
  textbox: {
    height: 24,
    padding: 11,
  },
});

class AutosuggestTextbox extends Component {
  constructor(props) {
    super(props);
    const { handleSuggestionsClearRequested, handleSuggestionsFetchRequested } = this.props;
    this.handleSuggestionsClearRequested = handleSuggestionsClearRequested.bind(this);
    this.handleSuggestionsFetchRequested = handleSuggestionsFetchRequested.bind(this);
  }

  state = { suggestions: [] }

  render() {
    const {
      classes, label, value, error, handleAutoSuggestChange, renderSuggestion, getSuggestionValue,
    } = this.props;

    const { suggestions } = this.state;

    const autosuggestProps = {
      renderInputComponent,
      suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    return (
      <Autosuggest
        {...autosuggestProps}
        inputProps={{
          label,
          value,
          onChange: handleAutoSuggestChange,
          helperText: error,
          error: error.length > 0,
          variant: 'outlined',
          InputLabelProps: {
            margin: 'dense',
          },
          classes: {
            input: classes.textbox,
          },
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
    );
  }
}

AutosuggestTextbox.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})]).isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  handleAutoSuggestChange: PropTypes.func.isRequired,
  handleSuggestionsClearRequested: PropTypes.func.isRequired,
  handleSuggestionsFetchRequested: PropTypes.func.isRequired,
  renderSuggestion: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func.isRequired,
};

export default withStyles(styles)(AutosuggestTextbox);
