import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import SidebarLinks from 'routes/SidebarLinks';
import withStyles from '@material-ui/core/styles/withStyles';
import Header from 'app/Header';
import Footer from 'app/Footer';
import Sidebar from 'app/Sidebar';
import appStyle from 'assets/jss/material-dashboard-pro-react/layouts/dashboardStyle';
import logo from 'assets/img/logo_transparent.png';
import { withRouter } from 'react-router';


class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      miniActive: false,
    };
    this.mainPanel = null;
    this.setMainPanelRef = (element) => {
      this.mainPanel = element;
    };
    this.resizeFunction = this.resizeFunction.bind(this);
    this.sidebarMinimize = this.sidebarMinimize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeFunction);
  }


  componentDidUpdate(prevProps) {
    const { mobileOpen } = this.state;
    const { location } = this.props;

    if (prevProps.location.pathname !== location.pathname) {
      this.mainPanel.scrollTop = 0;
      if (mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFunction);
  }

  getRoute() {
    const { location } = this.props;
    return location.pathname !== '/maps/full-screen-maps';
  }

  handleDrawerToggle = () => {
    const { mobileOpen } = this.state;
    this.setState({ mobileOpen: !mobileOpen });
  };

  sidebarMinimize() {
    const { miniActive } = this.state;
    this.setState({ miniActive: !miniActive });
  }

  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  render() {
    const { classes, ...rest } = this.props;
    const mainPanel =
      classes.mainPanel +
      ' ' +
      cx({
        [classes.mainPanelSidebarMini]: this.state.miniActive,
      });
    const { children } = this.props;
    const { mobileOpen, miniActive } = this.state;
    return (
      <React.Fragment>
        <div className={classes.wrapper}>
          <Sidebar
            routes={SidebarLinks}
            logoText="Migrant Hub"
            logo={logo}
            handleDrawerToggle={this.handleDrawerToggle}
            open={mobileOpen}
            color="blue"
            bgColor="blue"
            miniActive={miniActive}
            {...rest}
          />
          <div className={mainPanel} ref={this.setMainPanelRef}>
            <Header
              sidebarMinimize={this.sidebarMinimize.bind(this)}
              miniActive={miniActive}
              handleDrawerToggle={this.handleDrawerToggle}
              {...rest}
            />
            <div className={classes.content}>
              {children}
            </div>
            <Footer fluid />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(appStyle)(Layout));
