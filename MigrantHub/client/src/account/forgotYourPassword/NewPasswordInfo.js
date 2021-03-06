import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FormHelperText from '@material-ui/core/FormHelperText';
import validator from 'validator';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

const styles = ({});

class NewPasswordInfo extends Component {
    state = {
      showPassword: false,
      passwordError: '',
      confirmPasswordError: '',
    }

    handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

    validate = () => {
      const { password, confirmPassword, intl } = this.props;

      let isError = false;
      const errors = {
        passwordError: '',
        confirmPasswordError: '',
      };

      if (validator.isEmpty(password)) {
        errors.passwordError = `${intl.formatMessage({ id: 'password' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      } else if (validator.isEmpty(confirmPassword)) {
        errors.confirmPasswordError = intl.formatMessage({ id: 'account.validation.passwordConfirm' });
        isError = true;
      } else if (!validator.equals(password, confirmPassword)) {
        errors.passwordError = intl.formatMessage({ id: 'account.validation.passwordMatch' });
        errors.confirmPasswordError = intl.formatMessage({ id: 'account.validation.passwordMatch' });
        isError = true;
      } else if (!validator.isLength(password, { min: 8 })) {
        errors.passwordError = intl.formatMessage({ id: 'account.validation.passwordLength' });
        errors.confirmPasswordError = intl.formatMessage({ id: 'account.validation.passwordLength' });
        isError = true;
      }

      this.setState(prevState => ({
        ...prevState,
        ...errors,
      }));

      return isError;
    };

    render() {
      const { password, confirmPassword, handleChange } = this.props;
      const { showPassword, passwordError, confirmPasswordError } = this.state;

      return (
        <React.Fragment>
          <Typography variant="h6" gutterBottom>
                    Account Information
          </Typography>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={6}>
              <FormControl margin="normal" fullWidth>
                <InputLabel
                  htmlFor="password"
                  error={passwordError.length > 0}
                >
                  <FormattedMessage id="password" />
                </InputLabel>
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={event => handleChange(event)}
                  error={passwordError.length > 0}
                  endAdornment={(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                                )}
                />
                <FormHelperText
                  error={passwordError.length > 0}
                >
                  {passwordError}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl margin="normal" fullWidth>
                <InputLabel
                  htmlFor="password"
                  error={confirmPasswordError.length > 0 || passwordError.length > 0}
                >
                  <FormattedMessage id="signup.confirmpassword" />
                </InputLabel>
                <Input
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={event => handleChange(event)}
                  error={confirmPasswordError.length > 0 || passwordError.length > 0}
                  endAdornment={(
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleClickShowPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                                )}
                />
                <FormHelperText
                  error={confirmPasswordError.length > 0 || passwordError.length > 0}
                >
                  {confirmPasswordError}
                </FormHelperText>
              </FormControl>
            </Grid>
          </Grid>
        </React.Fragment>
      );
    }
}

NewPasswordInfo.propTypes = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default withStyles(styles)(injectIntl(NewPasswordInfo, { withRef: true }));
