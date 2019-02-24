import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import 'App.css';
import GoogleMaps from 'components/GoogleMaps/GoogleMaps';
import axios from 'axios';
import qs from 'qs';
import AddToCalendar from 'react-add-to-calendar';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link, Redirect } from 'react-router-dom';
import Button from 'components/CustomButtons/Button';
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import { cardTitle } from 'assets/jss/material-dashboard-pro-react';
import SweetAlert from 'react-bootstrap-sweetalert';
import sweetAlertStyle from 'assets/jss/material-dashboard-pro-react/views/sweetAlertStyle';
import { AuthConsumer } from 'routes/AuthContext';
import UserTypes from 'lib/UserTypes';
import moment from 'moment';

const styles = {
  ...sweetAlertStyle,
  cardIconTitle: {
    ...cardTitle,
    marginTop: "15px",
    marginBottom: "0px",
  },
  gridStyle: {
    backgroundColor: 'white',
    marginTop: '20px',
  }
};

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: props.match.params.id,
      eventName: '',
      eventDescription: '',
      location: '',
      dateStart: '',
      dateEnd: '',
      timeStart: '',
      timeEnd: '',
      eventImagePath: '',
      alert: null,
      redirect: false,
    };

    this.hideAlert = this.hideAlert.bind(this);
    this.successDelete = this.successDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.warningWithConfirmAndCancelMessage = this.warningWithConfirmAndCancelMessage.bind(this);
  }

  componentDidMount(props) {
    this.getData(this, props);
  }

  componentWillReceiveProps(props) {
    this.getData(this, props);
  }

  getData() {
    axios.get('/api/events/' + this.state.eventId, {
      params: {
        _id: this.state.eventId,
      },
    }).then((response) => {
      const parsedObj = qs.parse(qs.stringify(response.data));

      let tempLocation = {
        address: '',
        apartment: '',
        city: '',
        province: '',
        postalCode: '',
        phoneNumber: '',
      };

      if (parsedObj.location !== undefined) {
        tempLocation = parsedObj.location;
      }

      this.setState({
        eventName: parsedObj.eventName,
        eventDescription: parsedObj.description,
        location: tempLocation,
        dateStart: parsedObj.dateStart,
        dateEnd: parsedObj.dateEnd,
        timeStart: parsedObj.timeStart,
        timeEnd: parsedObj.timeEnd,
        eventImagePath: parsedObj.eventImagePath,
        eventOwner: parsedObj.user,
      });
    });
  }

  handleDelete = () => {
    const { eventId } = this.state;

    axios.delete('/api/events/' + eventId)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            redirect: true,
          });
        }
      });
  };

  warningWithConfirmAndCancelMessage() {
    this.setState({
      alert: (
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => this.successDelete()}
          onCancel={() => this.cancelDelete()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
          cancelBtnCssClass={
            this.props.classes.button + " " + this.props.classes.danger
          }
          confirmBtnText="Yes, delete it!"
          cancelBtnText="Cancel"
          showCancel
        >
          You will not be able to recover this event!
        </SweetAlert>
      ),
    });
  }

  successDelete() {
    this.setState({
      alert: (
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          Your event has been deleted.
        </SweetAlert>
      ),
    });
    this.handleDelete();
  }

  cancelDelete() {
    this.setState({
      alert: (
        <SweetAlert
          danger
          style={{ display: "block", marginTop: "-100px" }}
          title="Cancelled"
          onConfirm={() => this.hideAlert()}
          onCancel={() => this.hideAlert()}
          confirmBtnCssClass={
            this.props.classes.button + " " + this.props.classes.success
          }
        >
          Your event is safe :)
        </SweetAlert>
      ),
    });
  }

  hideAlert() {
    this.setState({
      alert: null,
    });
  }

  render() {
    const {
      classes,
    } = this.props;
    const {
      eventId, eventName, eventDescription, dateStart, dateEnd, timeStart, timeEnd, location, eventOwner, alert, redirect,
    } = this.state;
    let icon = { 'calendar-plus-o': 'left'};

    if (redirect) {
      return (
        <Redirect to="/events" />
      );
    }

    return (
      <AuthConsumer>
        {({ user }) => (
          <div>
            {alert}
            <GridItem xs={12} sm={12} md={12} lg={12}>
            <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <h4><b>Event</b></h4>
              </CardIcon>
              <h4 className={classes.cardIconTitle}><b>{eventName}</b></h4>
            </CardHeader>
            <CardBody>
              <GridItem xs={12} align='left'>
                <h5><b> Description </b></h5>
                  <h3>{eventDescription}</h3>
              </GridItem>
              
            {location !== undefined  && location.address !== '' && (
            <div>
            <GridItem xs={12} sm={12} md={12} lg={12} align='left'>
              <h5><b> Location </b></h5>
            </GridItem>
            <GridItem>
            <GridContainer xs={12} sm={12} md={12} lg={12} align='left'>
              <GridItem xs={12} sm={4} md={4} lg={2}>
              <h6>Address</h6>
                {' '}
                {location.address}
              </GridItem>
              {location.apartment !=='' && (
                <GridItem xs={12} sm={2} md={2} lg={2}>
                <h6>Apartment</h6>
                  {' '}
                  {location.apartment}
                </GridItem>
              )}
              <GridItem xs={12} sm={4} md={4} lg={3}>
              <h6>City</h6>
                {' '}
                {location.city}
              </GridItem>
              <GridItem  xs={12} sm={4} md={4} lg={2}>
              <h6>Province</h6>
                {' '}
                {location.province}
              </GridItem>
              <GridItem xs={12} sm={4} md={4} lg={2}>
              <h6>Postal Code</h6>
                {' '}
                {location.postalCode}
              </GridItem>
              <GridItem xs={12} sm={4} md={4} lg={2}>
                <h6>Phone Number</h6>
                {' '}
                {location.phoneNumber}
              </GridItem>
              </GridContainer>
              </GridItem>
            </div>
          )}
          <GridItem xs={12} sm={8} md={8} lg={4} align='left'>
              <h5><b> Time </b></h5>
          <GridItem xs={12}>
            From {moment(dateStart).format('MMM D YYYY')} at {timeStart}
          </GridItem>
          <GridItem xs={12}>
            Until {moment(dateEnd).format('MMM D YYYY')} at {timeEnd}
          </GridItem>
          </GridItem>
          { location !== undefined  && location.address !== '' && timeStart !== undefined && (
            <GridItem xs={12} sm={8} md={8} lg={4} align='left'>
              <Card><AddToCalendar event={this.state.event} buttonTemplate={icon}/></Card>
            </GridItem>
          )}
          {location !== undefined && location.address !== '' && (
              <GoogleMaps
                location={location}
              />
          )}
          </CardBody>
          </Card>
          </GridItem>
            <Grid item xs={12}>
              {user.type === UserTypes.ADMIN
                && (
                  <Button onClick={this.warningWithConfirmAndCancelMessage} color="danger">
                    Delete
                  </Button>
                )
              }
              {user.username === eventOwner && (
                <React.Fragment>
                  <Button onClick={this.warningWithConfirmAndCancelMessage} color="danger">
                    Delete
                  </Button>
                  <Button
                    color="primary"
                    component={props => <Link to={{ pathname: '/events/create', state: { editMode: true, eventId } }} {...props} />}
                  >
                    Edit
                  </Button>
                </React.Fragment>
              )}
            </Grid>
          </div>
        )}
      </AuthConsumer>
    );
  }
}

export default withStyles(styles)(EventDetails);
