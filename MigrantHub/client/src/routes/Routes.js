import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PropTypes from 'prop-types';
import AboutUs from 'app/AboutUs';
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
import SavedEventList from 'events/saved/SavedEventList';
import BugForm from 'forms/BugForm';
import BugList from 'bugs/BugList';
import BugDetails from 'bugs/BugDetails';
import ServiceDetails from 'services/ServiceDetails';
import EventDetails from 'events/EventDetails';
import { AuthConsumer } from 'routes/AuthContext';
import UsersList from 'People/UsersList';
import FriendPanel from 'components/FriendPanel/FriendPanel';
import AccountSelection from 'account/AccountSelection';
import ServiceSuggestionForm from 'services/ServiceSuggestionForm';
import ServiceSuggestionList from 'services/ServiceSuggestionList';
import ForgotYourPasswordForm from 'account/forgotYourPassword/ForgotYourPasswordForm';
import CreateReview from 'services/CreateReview';
import Logout from 'components/Logout';
import JobForm from 'jobs/form/JobForm';
import JobList from 'jobs/postings/JobList';
import JobDetails from 'jobs/postings/JobDetails';
import SavedJobList from 'jobs/saved/SavedJobList';
import ServiceCategoryList from 'services/ServiceCategoryList';
import SearchEventList from 'search/eventSearch/SearchEventList';
import SearchJobList from 'search/jobSearch/SearchJobList';
import SearchServiceList from 'search/serviceSearch/SearchServiceList';

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
          <UnprotectedRoute path="/signup/business" component={SignUpBusiness} disableLayout exact />
          <UnprotectedRoute path="/signup/personal" component={SignUpMigrant} disableLayout exact />
          <UnprotectedRoute path="/signup/admin" component={SignUpAdmin} disableLayout exact />
          <UnprotectedRoute path="/login" component={Login} disableLayout exact />
          <UnprotectedRoute path="/forgotpassword" component={ForgotYourPasswordForm} exact />
          <UnprotectedRoute path="/about-us" component={AboutUs} exact />
          <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} admin />
          <ProtectedRoute path="/editmigrant" component={EditMigrant} migrant exact />
          <ProtectedRoute path="/editbusiness" component={EditBusiness} business exact />
          <ProtectedRoute path="/categories" component={ServiceCategoryList} exact />
          <ProtectedRoute path="/profile/personal" component={EditMigrant} migrant exact />
          <ProtectedRoute path="/profile/business" component={EditBusiness} business exact />
          <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} admin />
          <ProtectedRoute path="/services/create" component={ServiceForm} exact />
          <ProtectedRoute path="/services/review/create/:id" component={CreateReview} exact />
          <ProtectedRoute path="/services/suggestions/create" component={ServiceSuggestionForm} migrant exact />
          <ProtectedRoute path="/services/suggestions" component={ServiceSuggestionList} business admin exact />
          <ProtectedRoute path="/services" component={ServiceList} exact />
          <ProtectedRoute path="/services/:id" component={ServiceDetails} />
          <ProtectedRoute path="/search/events" component={SearchEventList} exact />
          <ProtectedRoute path="/search/jobs" component={SearchJobList} exact />
          <ProtectedRoute path="/search/services" component={SearchServiceList} exact />
          <ProtectedRoute path="/search/:query" component={Search} />
          <ProtectedRoute path="/bugs/report" component={BugForm} exact />
          <ProtectedRoute path="/bugs" component={BugList} exact />
          <ProtectedRoute path="/bugs/:id" component={BugDetails} />
          <ProtectedRoute path="/events/create" component={EventForm} business exact />
          <ProtectedRoute path="/events" component={EventList} exact />
          <ProtectedRoute path="/events/saved" component={SavedEventList} exact />
          <ProtectedRoute path="/events/:id" component={EventDetails} />
          <ProtectedRoute path="/users" component={UsersList} exact />
          <ProtectedRoute path="/friends" component={FriendPanel} exact />
          <ProtectedRoute path="/logout" component={Logout} exact />
          <ProtectedRoute path="/jobs/create" component={JobForm} business exact />
          <ProtectedRoute path="/jobs" component={JobList} exact />
          <ProtectedRoute path="/jobs/saved" component={SavedJobList} exact />
          <ProtectedRoute path="/jobs/:id" component={JobDetails} />
          <Route path="/about-us" component={AboutUs} exact />
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
