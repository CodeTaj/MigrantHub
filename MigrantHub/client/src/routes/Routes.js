import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import SignUpMigrant from 'account/personal/SignUpMigrant';
import SignUpBusiness from 'account/business/SignUpBusiness';
import SignUpAdmin from 'account/admin/SignUpAdmin';
import Main from 'home/Main';
import BusinessMain from 'home/BusinessMain';
import Error from 'components/Error';
import Home from 'home/HomePage';
import Login from 'account/Login';
import EditMigrant from 'account/personal/EditMigrant';
import EditBusiness from 'account/business/EditBusiness';
import AdminDashboard from 'admin/AdminDashboard';
import ProtectedRoute from 'routes/ProtectedRoute';
import UnprotectedRoute from 'routes/UnprotectedRoute';
import ServiceForm from 'services/ServiceForm';
import ServiceList from 'services/ServiceList';
import Search from 'search/Search';
import EventList from 'events/EventList';
import EventForm from 'events/EventForm';
import ServiceDetails from 'services/ServiceDetails';
import EventDetails from 'events/EventDetails';
import ViewMigrantProfile from 'account/personal/ViewMigrantProfile';
import ViewBusinessProfile from 'account/business/ViewBusinessProfile';
import { AuthConsumer } from 'routes/AuthContext';
import UsersList from 'People/UsersList';
import FriendPanel from 'components/FriendPanel/FriendPanel';
import AccountSelection from 'account/AccountSelection';
import ServiceSuggestionForm from 'services/ServiceSuggestionForm';
import ServiceSuggestionList from 'services/ServiceSuggestionList';
import ForgotYourPasswordForm from 'account/forgotYourPassword/ForgotYourPasswordForm';

class Routes extends Component {
  state = {
    isLoading: true,
  }

  async componentDidMount() {
    const Auth = this.context;
    await Auth.authenticate();
    this.setState({
      isLoading: false,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { location } = this.props;
    if (nextProps.location !== location) {
      toast.dismiss();
    }
  }

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <div />;
    }
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange={false}
          draggable
          pauseOnHover={false}
        />
        <Switch>
          <UnprotectedRoute path="/" component={Home} exact />
          <ProtectedRoute path="/main" component={Main} migrant exact />
          <ProtectedRoute path="/businessmain" component={BusinessMain} business exact />
          <UnprotectedRoute path="/signup/account-selection" component={AccountSelection} exact />
          <UnprotectedRoute path="/signup/business" component={SignUpBusiness} exact />
          <UnprotectedRoute path="/signup/personal" component={SignUpMigrant} exact />
          <UnprotectedRoute path="/signup/admin" component={SignUpAdmin} exact />
          <UnprotectedRoute path="/login" component={Login} disableLayout exact />
          <UnprotectedRoute path="/forgotpassword" component={ForgotYourPasswordForm} exact />
          <ProtectedRoute path="/editmigrant" component={EditMigrant} migrant exact />
          <ProtectedRoute path="/editbusiness" component={EditBusiness} business exact />
          <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} admin />
          <ProtectedRoute path="/services/create" component={ServiceForm} exact />
          <ProtectedRoute path="/services/suggestions/create" component={ServiceSuggestionForm} migrant exact />
          <ProtectedRoute path="/services/suggestions" component={ServiceSuggestionList} business admin exact />
          <ProtectedRoute path="/services" component={ServiceList} exact />
          <ProtectedRoute path="/services/:id" component={ServiceDetails} />
          <ProtectedRoute path="/search" component={Search} exact />
          <ProtectedRoute path="/events/create" component={EventForm} exact />
          <ProtectedRoute path="/events" component={EventList} exact />
          <ProtectedRoute path="/events/:id" component={EventDetails} />
          <ProtectedRoute path="/users" component={UsersList} exact />
          <ProtectedRoute path="/migrant/profile" component={ViewMigrantProfile} exact />
          <ProtectedRoute path="/business/profile" component={ViewBusinessProfile} exact />
          <ProtectedRoute path="/friends" component={FriendPanel} exact />
          <Route component={Error} />
        </Switch>
      </>
    );
  }
}

Routes.propTypes = {
  location: PropTypes.shape({}).isRequired,
};

Routes.contextType = AuthConsumer;

export default withRouter(Routes);
