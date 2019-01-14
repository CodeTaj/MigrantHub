import React, { Component } from 'react';
import {
  Navbar, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown,
  DropdownToggle, DropdownMenu, DropdownItem,
} from 'mdbreact';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import 'App.css';
import Logout from 'components/Logout';
import AdminMain from 'admin/AdminMain';
import CurrentAdmins from 'admin/CurrentAdmins';
import RejectedAdmins from 'admin/RejectedAdmins';
import DeletedAdmins from 'admin/DeletedAdmins';
import UnapprovedAdmins from 'admin/UnapprovedAdmins';
import ServiceList from 'services/ServiceList';
import EventList from 'events/EventList'
import ServiceSuggestionList from 'services/ServiceSuggestionList';

class AdminDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
      isWideEnough: false,
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  render() {
    const { isWideEnough, collapse } = this.state;
    const { match } = this.props;

    return (
      <React.Fragment>
        <Navbar color="indigo" dark expand="md" scrolling>
          { !isWideEnough && <NavbarToggler onClick={this.onClick} />}
          <Collapse isOpen={collapse} navbar>
            <NavbarNav left>
              <NavItem>
                <NavLink to="/admin/dashboard">Home</NavLink>
              </NavItem>
            </NavbarNav>
            <NavbarNav right>
              <NavItem>
                <NavLink to={`${match.url}/admin/services`}>Services</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={`${match.url}/admin/services/suggestions`}>Service Suggestions</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to={`${match.url}/admin/event`}>Event</NavLink>
              </NavItem>
              <NavItem>
                <Dropdown>
                  <DropdownToggle nav caret>Admins</DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem><NavLink to={`${match.url}/admins`} style={{ color: 'black' }}>Current</NavLink></DropdownItem>
                    <DropdownItem><NavLink to={`${match.url}/admins/deleted`} style={{ color: 'black' }}>Deleted</NavLink></DropdownItem>
                    <DropdownItem><NavLink to={`${match.url}/admins/rejected`} style={{ color: 'black' }}>Rejected</NavLink></DropdownItem>
                    <DropdownItem><NavLink to={`${match.url}/admins/unapproved`} style={{ color: 'black' }}>Unapproved</NavLink></DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavItem>
              <NavItem>
                <Logout />
              </NavItem>
            </NavbarNav>
          </Collapse>
        </Navbar>
        <Route path={`${match.url}/`} component={AdminMain} exact />
        <Route path={`${match.url}/admins`} component={CurrentAdmins} exact />
        <Route path={`${match.url}/admins/deleted`} component={DeletedAdmins} exact />
        <Route path={`${match.url}/admins/rejected`} component={RejectedAdmins} exact />
        <Route path={`${match.url}/admins/unapproved`} component={UnapprovedAdmins} exact />
        <Route path={`${match.url}/admin/services`} component={ServiceList} exact />
        <Route path={`${match.url}/admin/event`} component={EventList} exact />
        <Route path={`${match.url}/admin/services/suggestions`} component={ServiceSuggestionList} exact />
      </React.Fragment>
    );
  }
}

AdminDashboard.propTypes = {
  match: PropTypes.shape({}).isRequired,
};

export default AdminDashboard;
