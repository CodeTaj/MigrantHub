import React, { Component } from 'react';
import axios from 'axios';
import SignUp from 'account/common/SignUp';
import AccountInfo from 'account/common/AccountInfo';
import { FormattedMessage } from 'react-intl';

const qs = require('qs');

class SignUpAdmin extends Component {
  getStepContent(step) {
    const { email, password } = this.state;

    switch (step) {
      case 0:
        return (
          <AccountInfo
            innerRef={this.child}
            handleChange={this.handleChange}
            email={email}
            password={password}
          />
        );
      default:
        throw new Error('Unknown step');
    }
  }

  // Send profile data in post body to add to mongodb
  createAccount(e) {
    axios.post('/api/accounts/create/admin',
      qs.stringify({
        email: e.state.email,
        password: e.state.password,
      })).then((response) => {
      e.setState({
        messageFromServer: response.data,
      });
    }).catch((error) => {
        e.setState({
            messageFromServer: error.response.data,
        });
    });
  }

  render() {
    const steps = [<FormattedMessage id="signup.account" />];

    return (
      <React.Fragment>
        <SignUp
          createAccount={this.createAccount}
          steps={steps}
          getStepContent={this.getStepContent}
        />
      </React.Fragment>
    );
  }
}

export default SignUpAdmin;
