import React, { Component } from 'react';
import Datetime from 'react-datetime';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import validator from 'validator';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import FormData from 'form-data';
import qs from 'qs';
import { provinces } from 'lib/SignUpConstants';
import { serviceCategories } from 'lib/ServiceCategories';
import { PhoneMask, PostalCodeMask } from 'lib/Masks';
import Clearfix from 'components/Clearfix/Clearfix.jsx';
import moment from 'moment';
import SweetAlert from 'react-bootstrap-sweetalert';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import CustomInput from 'components/CustomInput/CustomInput.jsx';
import Button from '@material-ui/core/Button';
import Card from 'components/Card/Card.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardText from 'components/Card/CardText.jsx';
import CardIcon from 'components/Card/CardIcon.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import ImageUpload from 'components/CustomUpload/ImageUpload.jsx';

// @material-ui/core components
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import { FormHelperText, Grid } from '@material-ui/core';

// @material-ui/icons
import Today from '@material-ui/icons/Today';
import Location from '@material-ui/icons/Map';
import AvTimer from '@material-ui/icons/AvTimer';

import extendedFormsStyle from 'assets/jss/material-dashboard-pro-react/views/extendedFormsStyle.jsx';
import regularFormsStyle from 'assets/jss/material-dashboard-pro-react/views/regularFormsStyle';
import defaultImage from 'assets/img/image_placeholder.jpg';
import defaultAvatar from 'assets/img/placeholder.jpg';
import { toast } from 'react-toastify';

const dayOfTheWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

const serviceHoursObject = { serviceDay: '', startTime: '', endTime: '' };

const styles = theme => ({
  ...extendedFormsStyle,
  ...regularFormsStyle,
  container: {
    position: 'relative',
  },
  formControl: {
    textAlign: 'left',
  },
  select: {
    textAlign: 'left',
  },
});

class ServiceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage,
      serviceHoursError: [],
      serviceDescriptionError: '',
      serviceSummaryError: '',
      serviceTitleError: '',
      categoryError: '',
      subcategoryError: '',
      addressError: '',
      apartmentError: '',
      cityError: '',
      provinceError: '',
      postalCodeError: '',
      phoneNumberError: '',
      serviceImageError: '',
      startDateError: '',
      endDateError: '',
      serviceId: '',
      serviceHours: [],
      serviceDate: {
        startDate: '',
        endDate: '',
      },
      location: {
        address: '',
        apartment: '',
        city: '',
        province: '',
        postalCode: '',
        phoneNumber: '',
      },
      serviceImage: null,
      serviceImageName: '',
      serviceImagePath: '',
      tempServiceImagePath: '',
      setDefaultImage: false,
      serviceDescription: '',
      serviceSummary: '',
      serviceTitle: '',
      addLocation: false,
      addServiceDate: false,
      serviceHoursCount: 0,
      dataRetrieved: false,
      category: '',
      subcategory: '',
      subcategoriesArray: [],
      // Server response
      messageFromServer: '',
      redirectToAllServices: false,
      alert: null,
    };
    this.hideAlert = this.hideAlert.bind(this);
    this.imageRef = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleRemove = this.handleRemove.bind(this);

    const { location } = this.props;
    if (location.state) {
      this.getData = this.getData.bind(this);
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  componentDidMount() {
    const { location } = this.props;
    if (location.state) {
      this.getData(this);
    }
  }

  autoCloseAlert() {
    this.setState({
      alert: (
        <SweetAlert
          style={{ display: 'block', marginTop: '-100px' }}
          title="Update Successful"
          onConfirm={() => this.hideAlert()}
          showConfirm={false}
        >
          This will close in 2 seconds.
        </SweetAlert>
      ),
    });
    setTimeout(this.hideAlert, 2000);
  }

  hideAlert() {
    this.setState({
      alert: null,
    });
    this.updateService();
  }

  componentWillReceiveProps() {
    const { location } = this.props;
    if (location.state) {
      this.getData(this);
    }
  }

  getData() {
    const { dataRetrieved } = this.state;
    const { location } = this.props;
    const { state } = location;
    const { editMode, serviceId } = state;

    if (!dataRetrieved) {
      this.setState({
        editMode,
        serviceId,
      });

      axios.get('/api/services/get/', {
        params: {
          _id: serviceId,
        },
      }).then((response) => {
        const parsedObj = qs.parse(qs.stringify(response.data));
        let locationExists = false;
        let serviceDateExists = false;
        let tempServiceHours = [];
        let tempServiceDate = {
          startDate: '',
          endDate: '',
        };
        let tempLocation = {
          address: '',
          apartment: '',
          city: '',
          province: '',
          postalCode: '',
          phoneNumber: '',
        };

        if (parsedObj.serviceHours !== undefined) {
          tempServiceHours = parsedObj.serviceHours;
        }
        if (parsedObj.location !== undefined) {
          locationExists = true;
          tempLocation = parsedObj.location;
        }
        if (parsedObj.serviceDate !== undefined) {
          serviceDateExists = true;
          tempServiceDate = {
            startDate: parsedObj.serviceDate.startDate.toString().substring(0, 10),
            endDate: parsedObj.serviceDate.endDate.toString().substring(0, 10),
          };
        }
        this.handleSubCategoryChange(parsedObj.category);
        const imagePath = parsedObj.serviceImagePath.split('/');
        const imageName = imagePath[imagePath.length - 1];

        this.setState({
          serviceTitle: parsedObj.serviceTitle,
          serviceSummary: parsedObj.serviceSummary,
          serviceDescription: parsedObj.serviceDescription,
          category: parsedObj.category,
          subcategory: parsedObj.subcategory,
          serviceDate: tempServiceDate,
          location: tempLocation,
          serviceHours: tempServiceHours,
          addLocation: locationExists,
          addServiceDate: serviceDateExists,
          serviceImagePath: parsedObj.serviceImagePath,
          tempServiceImagePath: parsedObj.serviceImagePath,
          serviceImageName: imageName,
          dataRetrieved: true,
        });
      });
    }
  }

  handleAddObject = (name, object) => {
    this.state.serviceHoursCount += 1;
    this.setState({
      [name]: this.state[name].concat([object]),
    });
  }

  handleRemoveObject = (name, index) => {
    this.state.serviceHoursCount -= 1;
    this.setState({
      [name]: this.state[name].filter((s, _index) => _index !== index),
    });
  }

  handleEditObject= (name, fieldName, index, event) => {
    if (event !== undefined) {
      this.setState({
        [name]: this.state[name].map((s, _index) => {
          if (_index !== index) return s;
          if (event !== moment.isMoment()) {
            event = moment(event);
          }
          return { ...s, [fieldName]: event.format('LT') };
        }),
      });
    }
  }

  handleEditObjectServiceDay= (name, index) => (event) => {
    this.setState({
      [name]: this.state[name].map((s, _index) => {
        if (_index !== index) return s;
        return { ...s, [event.target.name]: event.target.value };
      }),
    });
  }

  handleCategoryChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      subcategoriesArray: [],
      subcategory: '',
    });

    this.handleSubCategoryChange(event.target.value);
  }

  handleSubCategoryChange = (value) => {
    const tempArray = serviceCategories.find(x => x.value === value).SubCategories;

    if (tempArray) {
      this.setState({
        subcategoriesArray: tempArray,
      });
    }
  }

  handleAddLocation = () => {
    this.setState(prevState => ({
      addLocation: !prevState.addLocation,
    }));
  }

  handleAddServiceDate = () => {
    this.setState(prevState => ({
      addServiceDate: !prevState.addServiceDate,
    }));
  }


  handleSubmit = (event) => {
    const error = this.validate();
    if (!error) {
      this.createService(event);
    }
  }

  handleUpdate = () => {
    const error = this.validate();
    if (!error) {
      this.updateService();
    }
  }

  handleEditSingleObject = (name, fieldName, event) => {
    const obj = {};
    obj[name] = { ...this.state[name] };
    if (event !== moment.isMoment()) {
      event = moment(event);
    }
    const value = event.format('L');
    obj[name][fieldName] = value;
    this.setState({ [name]: obj[name] });
  }

  handleEditLocationObject = (name, fieldName) => (event) => {
    const obj = {};
    obj[name] = { ...this.state[name] };
    const value = event.target.value;
    obj[name][fieldName] = value;
    this.setState({ [name]: obj[name] });
  }

  handleImageChange(e) {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file,
        serviceImageName: file.name,
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }

  handleRemove() {
    this.setState({
      file: null,
      serviceImageName: '',
      imagePreviewUrl: this.props.avatar ? defaultAvatar : defaultImage,
    });
    this.imageRef.current.value = null;
  }

  handleClick() {
    this.imageRef.current.click();
  }

  renderRedirectToAllServices = () => {
    const { redirectToAllServices } = this.state;
    if (redirectToAllServices) {
      return <Redirect to="/services" />;
    }
  }

  validate = () => {
    let isError = false;
    const { intl } = this.props;

    const {
      serviceTitle, serviceSummary, serviceDescription, serviceHours, serviceDate,
      location, addLocation, addServiceDate, serviceImageName, serviceImage, category,
      subcategory, subcategoriesArray,
    } = this.state;

    const errors = {
      serviceHoursError: [],
      serviceTitleError: '',
      serviceDescriptionError: '',
      serviceSummaryError: '',
      categoryError: '',
      subcategoryError: '',
      addressError: '',
      apartmentError: '',
      cityError: '',
      provinceError: '',
      postalCodeError: '',
      phoneNumberError: '',
      serviceImageError: '',
      startDateError: '',
      endDateError: '',
    };

    if (validator.isEmpty(serviceTitle)) {
      errors.serviceTitleError = `${intl.formatMessage({ id: 'form.title' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
      isError = true;
    }
    if (validator.isEmpty(serviceSummary)) {
      errors.serviceSummaryError = `${intl.formatMessage({ id: 'form.summary' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
      isError = true;
    }
    if (validator.isEmpty(serviceDescription)) {
      errors.serviceDescriptionError = `${intl.formatMessage({ id: 'form.description' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
      isError = true;
    }
    if (validator.isEmpty(category)) {
      errors.categoryError = `${intl.formatMessage({ id: 'form.category' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
      isError = true;
    }
    if (subcategoriesArray.length > 0) {
      if (validator.isEmpty(subcategory)) {
        errors.subcategoryError = `${intl.formatMessage({ id: 'form.subcategory' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      }
    }
    if (serviceImage !== null) {
      if (!validator.matches(serviceImageName, '.([.jpg]|[.jpeg]|[.png])$')) {
        errors.serviceImageError = `${intl.formatMessage({ id: 'form.image' })}  ${intl.formatMessage({ id: 'notvalid' })} .jpg, .jpeg or .png`;
        isError = true;
      }
    }
    if (addServiceDate) {
      const date = new Date();
      const todaysDate = (`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
      if (validator.isEmpty(serviceDate.startDate)) {
        errors.startDateError = `${intl.formatMessage({ id: 'form.day.start' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      } else if (validator.isBefore(serviceDate.startDate, todaysDate)) {
        errors.startDateError = `${intl.formatMessage({ id: 'form.day.start' })}  ${intl.formatMessage({ id: 'notvalid' })}`;
        isError = true;
      }
      if (validator.isEmpty(serviceDate.endDate)) {
        errors.endDateError = `${intl.formatMessage({ id: 'form.day.end' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      } else if (validator.isBefore(serviceDate.endDate, serviceDate.startDate)) {
        errors.endDateError = `${intl.formatMessage({ id: 'form.day.end' })}  ${intl.formatMessage({ id: 'notvalid' })}`;
        isError = true;
      }
    }
    if (addLocation) {
      if (validator.isEmpty(location.address)) {
        errors.addressError = `${intl.formatMessage({ id: 'contact.address' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      }
      if (validator.isEmpty(location.city)) {
        errors.cityError = `${intl.formatMessage({ id: 'contact.city' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      } else if (!validator.isAlpha(location.city)) {
        errors.cityError = `${intl.formatMessage({ id: 'contact.city' })}  ${intl.formatMessage({ id: 'notvalid' })}`;
        isError = true;
      }
      if (validator.isEmpty(location.province)) {
        errors.provinceError = `${intl.formatMessage({ id: 'contact.province' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      }
      if (validator.isEmpty(location.postalCode)) {
        errors.postalCodeError = `${intl.formatMessage({ id: 'contact.postal' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      } else if (!validator.isLength(location.postalCode, { min: 7, max: 7 })) {
        errors.postalCodeError = `${intl.formatMessage({ id: 'contact.postal' })}  ${intl.formatMessage({ id: 'notvalid' })}`;
        isError = true;
      }
      if (validator.isEmpty(location.phoneNumber)) {
        errors.phoneNumberError = `${intl.formatMessage({ id: 'contact.phone' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      } else if (!validator.isLength(location.phoneNumber, { min: 14, max: 14 })) {
        errors.phoneNumberError = `${intl.formatMessage({ id: 'contact.phone' })}  ${intl.formatMessage({ id: 'notvalid' })}`;
        isError = true;
      }
    }

    serviceHours.forEach((member, index) => {
      errors.serviceHoursError = errors.serviceHoursError.concat([JSON.parse(
        JSON.stringify(serviceHoursObject),
      )]);
      if (validator.isEmpty(member.startTime)) {
        errors.serviceHoursError[index].startTime = `${intl.formatMessage({ id: 'form.time.start' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      }
      if (validator.isEmpty(member.endTime)) {
        errors.serviceHoursError[index].endTime = `${intl.formatMessage({ id: 'form.time.end' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      } else if (member.endTime <= member.startTime) {
        errors.serviceHoursError[index].endTime = `${intl.formatMessage({ id: 'form.time.end' })}  ${intl.formatMessage({ id: 'notvalid' })}`;
        isError = true;
      }
      if (validator.isEmpty(member.serviceDay)) {
        errors.serviceHoursError[index].serviceDay = `${intl.formatMessage({ id: 'form.day' })}  ${intl.formatMessage({ id: 'isrequired' })}`;
        isError = true;
      }
    });

    this.setState(prevState => ({
      ...prevState,
      ...errors,
    }));

    return isError;
  }

  objectErrorText = (name, index, field) => (this.state[name][index] === undefined ? '' : this.state[name][index][field])

  createService = (event) => {
    const {
      serviceTitle, serviceSummary, serviceDescription, serviceHours, serviceDate,
      location, addLocation, serviceImageName, addServiceDate, category, subcategory, file,
    } = this.state;

    event.preventDefault();
    let tempImageName = 'montrealCity.png';
    let tempLocation = {};
    let tempServiceDate = {};

    if (serviceImageName !== '') {
      tempImageName = serviceImageName;
    }
    if (addLocation) {
      tempLocation = location;
    }
    if (addServiceDate) {
      tempServiceDate = serviceDate;
    }
    const formData = new FormData();
    formData.append('serviceImage', file);
    formData.append('serviceDetails', qs.stringify({
      location: tempLocation,
      serviceHours,
      serviceDate: tempServiceDate,
      serviceTitle,
      serviceDescription,
      serviceSummary,
      category,
      subcategory,
      serviceImageName: tempImageName,
    }));

    axios.post('/api/services/', formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
      if (response.status === 200) {
        this.setState({
          redirectToAllServices: true,
        });
      }
    }).catch((error) => {
      this.setState({
        messageFromServer: error.response.data,
      });
    });
  }

  updateService = () => {
    const {
      serviceId, serviceTitle, serviceSummary, serviceDescription, serviceHours, serviceDate,
      location, addLocation, addServiceDate, serviceImageName, serviceImage, serviceImagePath,
      setDefaultImage, category, subcategory, file,
    } = this.state;

    let tempImageName = serviceImageName;
    let tempLocation = {};
    let tempServiceDate = {};

    if (serviceImageName === '') {
      tempImageName = 'montrealCity.png';
    } else if (serviceImage !== null) {
      tempImageName = serviceImage.name;
    }

    if (setDefaultImage) {
      tempImageName = 'montrealCity.png';
    }

    if (addLocation) {
      tempLocation = location;
    }
    if (addServiceDate) {
      tempServiceDate = serviceDate;
    }

    const formData = new FormData();
    formData.append('serviceImage', file);
    formData.append('serviceDetails', qs.stringify({
      location: tempLocation,
      serviceHours,
      serviceDate: tempServiceDate,
      serviceTitle,
      serviceDescription,
      serviceSummary,
      category,
      subcategory,
      serviceImageName: tempImageName,
      _id: serviceId,
      serviceImagePath,
    }));

    axios.put(`/api/services/${serviceId}`, formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
      if (response.status === 200) {
        toast.success('Updated service!');
      }
    }).catch((error) => {
      this.setState({
        messageFromServer: error.response.data,
      });
    });
  }

  render() {
    const { classes } = this.props;
    const {
      serviceTitleError, serviceDescriptionError, serviceSummaryError, addressError,
      apartmentError, cityError, provinceError, postalCodeError, phoneNumberError,
      serviceImageError, startDateError, endDateError, serviceTitle, serviceSummary,
      serviceDescription, serviceHours, serviceDate, location,
      addLocation, addServiceDate, serviceHoursCount, messageFromServer, editMode,
      category, categoryError, subcategory, subcategoryError,
      subcategoriesArray, file, imagePreviewUrl, alert,
    } = this.state;

    return (
      <React.Fragment>
        <div className={classes.mainContainer}>
          {messageFromServer.split('\n').map((item, key) => (
            <span key={key}>
              {item}
              <br />
            </span>
          ))}
          {this.renderRedirectToAllServices()}
          {alert}
          <GridContainer>
            <GridItem lg={12} md={12} sm={12} xs={12}>
              <Card>
                <CardHeader color="rose" text>
                  <CardText color="rose">
                    <h4><FormattedMessage id="service.form" /></h4>
                  </CardText>
                </CardHeader>
                <CardBody>
                  <form>
                    <GridContainer>
                      <GridItem lg={5} md={5} sm={12} xs={12}>
                        <ImageUpload
                          id="serviceImage"
                          addButtonProps={{
                            color: 'grey',
                            round: true,
                          }}
                          changeButtonProps={{
                            color: 'success',
                            round: true,
                          }}
                          removeButtonProps={{
                            color: 'danger',
                            round: true,
                          }}
                          handleClick={this.handleClick}
                          handleImageChange={this.handleImageChange}
                          handleRemove={this.handleRemove}
                          file={file}
                          imagePreviewUrl={imagePreviewUrl}
                          imageRef={this.imageRef}
                          helperText={serviceImageError}
                          error={serviceImageError.length > 0}
                        />
                      </GridItem>
                      <GridItem lg={6} md={6} sm={12} xs={12}>
                        <GridContainer>
                          <GridItem lg={12} md={12} sm={12} xs={12}>
                            <CustomInput
                              className={classes.input}
                              labelText={<FormattedMessage id="form.title" />}
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                id: 'serviceTitle',
                                name: 'serviceTitle',
                                value: serviceTitle,
                                onChange: event => this.handleChange(event),
                              }}
                              fullWidth
                              helperText={serviceTitleError}
                              error={serviceTitleError.length > 0}
                            />
                          </GridItem>
                          <GridItem lg={6} md={6} sm={12} xs={12}>
                            <FormControl
                              fullWidth
                              className={classes.selectFormControl}
                            >
                              <InputLabel
                                htmlFor="simple-select"
                                className={classes.selectLabel}
                              >
                                <FormattedMessage id="form.select.category" />
                              </InputLabel>
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                classes={{
                                  select: classes.select,
                                }}
                                value={category}
                                inputProps={{
                                  name: 'category',
                                  id: 'category',
                                }}
                                name="category"
                                select
                                label={<FormattedMessage id="form.select.category" />}
                                onChange={event => this.handleCategoryChange(event)}
                                fullWidth
                                helperText={categoryError}
                                error={categoryError.length > 0}
                              >
                                <MenuItem
                                  disabled
                                  classes={{ root: classes.selectMenuItem }}
                                >
                                  <FormattedMessage id="form.select.category" />
                                </MenuItem>
                                {serviceCategories.map(option => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected,
                                    }}
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormHelperText error={categoryError.length > 0}>{categoryError}</FormHelperText>
                          </GridItem>
                          <GridItem lg={6} md={6} sm={12} xs={12}>
                            <FormControl
                              className={classes.selectFormControl}
                              name="subcategory"
                              select
                              label={<FormattedMessage id="form.select.subcategory" />}
                              onChange={event => this.handleChange(event)}
                              fullWidth
                              helperText={subcategoryError}
                              error={subcategoryError.length > 0}
                            >
                              <InputLabel
                                htmlFor="simple-select"
                                className={classes.selectLabel}
                              >
                                <FormattedMessage id="form.select.subcategory" />
                              </InputLabel>
                              <Select
                                MenuProps={{
                                  className: classes.selectMenu,
                                }}
                                classes={{
                                  select: classes.select,
                                }}
                                value={subcategory}
                                onChange={event => this.handleChange(event)}
                                inputProps={{
                                  name: 'subcategory',
                                  id: 'subcategory',
                                }}
                              >
                                <MenuItem
                                  disabled
                                  classes={{
                                    root: classes.selectMenuItem,
                                  }}
                                >
                                  <FormattedMessage id="form.select.subcategory" />
                                </MenuItem>
                                {subcategoriesArray.map(option => (
                                  <MenuItem
                                    classes={{
                                      root: classes.selectMenuItem,
                                      selected: classes.selectMenuItemSelected,
                                    }}
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            <FormHelperText error={subcategoryError.length > 0}>{subcategoryError}</FormHelperText>
                          </GridItem>
                          <GridItem lg={12} md={12} sm={12} xs={12}>
                            <CustomInput
                              labelText={<FormattedMessage id="form.summary" />}
                              formControlProps={{
                                fullWidth: true,
                              }}
                              inputProps={{
                                name: 'serviceSummary',
                                id: 'serviceSummary',
                                value: serviceSummary,
                                onChange: event => this.handleChange(event),
                              }}
                              helperText={serviceSummaryError}
                              error={serviceSummaryError.length > 0}
                            />
                          </GridItem>
                        </GridContainer>
                      </GridItem>
                      <GridItem lg={6} md={6} sm={12} xs={12}>
                        <CustomInput
                          labelText={<FormattedMessage id="form.description" />}
                          formControlProps={{
                            fullWidth: true,
                          }}
                          inputProps={{
                            multiline: true,
                            rows: 5,
                            name: 'serviceDescription',
                            id: 'serviceDescription',
                            onChange: event => this.handleChange(event),
                            error: serviceDescriptionError.length > 0,
                          }}
                          value={serviceDescription}
                          helperText={serviceDescriptionError}
                          error={serviceDescriptionError.length > 0}
                        />
                      </GridItem>
                      <GridItem lg={6} md={6} sm={12} xs={12}>
                        <Card>
                          <CardHeader color="rose" icon>
                            <CardIcon color="rose">
                              <Location />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>
                              <FormattedMessage id="form.location" />
                              (<FormattedMessage id="form.optional" />)
                            </h4>
                          </CardHeader>
                          <CardBody>
                            {addLocation
                              ? (
                                <Button
                                  justIcon
                                  round
                                  color="secondary"
                                  aria-label="Add Location"
                                  onClick={event => this.handleAddLocation()}
                                  className={classes.button}
                                >
                                  <DeleteIcon />
                                </Button>
                              )
                              : (
                                <Button
                                  justIcon
                                  round
                                  color="secondary"
                                  aria-label="Add Location"
                                  onClick={event => this.handleAddLocation()}
                                  className={classes.button}
                                >
                                  <AddIcon />
                                </Button>
                              )}
                            {addLocation === true && (
                              <GridItem>
                                <GridContainer>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <CustomInput
                                      className={classes.input}
                                      labelText={<FormattedMessage id="contact.address" />}
                                      formControlProps={{
                                        fullWidth: true,
                                      }}
                                      inputProps={{
                                        name: 'address',
                                        id: 'address',
                                        value: location.address,
                                        onChange: this.handleEditLocationObject('location', 'address'),
                                      }}
                                      helperText={addressError}
                                      error={addressError.length > 0}
                                    />
                                  </GridItem>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <CustomInput
                                      labelText={<FormattedMessage id="contact.city" />}
                                      formControlProps={{
                                        fullWidth: true,
                                      }}
                                      inputProps={{
                                        name: 'city',
                                        id: 'city',
                                        value: location.city,
                                        onChange: this.handleEditLocationObject('location', 'city'),
                                      }}
                                      helperText={cityError}
                                      error={cityError.length > 0}
                                    />
                                  </GridItem>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <CustomInput
                                      labelText={<FormattedMessage id="contact.apartment" />}
                                      id="apartment"
                                      formControlProps={{
                                        fullWidth: true,
                                      }}
                                      inputProps={{
                                        name: 'apartment',
                                        id: 'apartment',
                                        value: location.apartment,
                                        onChange: this.handleEditLocationObject('location', 'apartment'),
                                      }}
                                      helperText={apartmentError}
                                      error={apartmentError.length > 0}
                                    />
                                  </GridItem>
                                </GridContainer>
                                <GridContainer>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <FormControl
                                      fullWidth
                                      className={classes.selectFormControl}
                                    >
                                      <InputLabel
                                        htmlFor="simple-select"
                                        className={classes.selectLabel}
                                      >
                                        Province
                                      </InputLabel>
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu,
                                        }}
                                        classes={{
                                          select: classes.select,
                                        }}
                                        value={location.province}
                                        inputProps={{
                                          name: 'province',
                                        }}
                                        id="province"
                                        onChange={this.handleEditLocationObject('location', 'province')}
                                        name="province"
                                        select
                                        label={<FormattedMessage id="contact.province" />}
                                        fullWidth
                                        helperText={provinceError}
                                        error={provinceError.length > 0}
                                      >
                                        <MenuItem
                                          disabled
                                          classes={{
                                            root: classes.selectMenuItem,
                                          }}
                                        >
                                          <FormattedMessage id="contact.province" />
                                        </MenuItem>
                                        {provinces.map(option => (
                                          <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                    <FormHelperText error={provinceError.length > 0}>{provinceError}</FormHelperText>
                                  </GridItem>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <CustomInput
                                      labelText={<FormattedMessage id="contact.postal" />}
                                      formControlProps={{
                                        fullWidth: true,
                                      }}
                                      inputProps={{
                                        name: 'postalCode',
                                        id: 'postalCode',
                                        value: location.postalCode.toUpperCase(),
                                        onChange: this.handleEditLocationObject('location', 'postalCode'),
                                        inputComponent: PostalCodeMask,
                                      }}
                                      helperText={postalCodeError}
                                      error={postalCodeError.length > 0}
                                    />
                                  </GridItem>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <CustomInput
                                      labelText={<FormattedMessage id="contact.phone" />}
                                      id="phoneNumber"
                                      formControlProps={{
                                        fullWidth: true,
                                      }}
                                      inputProps={{
                                        name: 'phoneNumber',
                                        id: 'phoneNumber',
                                        value: location.phoneNumber,
                                        onChange: this.handleEditLocationObject('location', 'phoneNumber'),
                                        inputComponent: PhoneMask,
                                      }}
                                      helperText={phoneNumberError}
                                      error={phoneNumberError.length > 0}
                                    />
                                  </GridItem>
                                </GridContainer>
                              </GridItem>
                            )}
                          </CardBody>
                        </Card>
                      </GridItem>
                      <GridItem lg={6} md={6} sm={12} xs={12}>
                        <Card>
                          <CardHeader color="rose" icon>
                            <CardIcon color="rose">
                              <Today />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>
                              <FormattedMessage id="form.date" />
                              (<FormattedMessage id="form.optional" />)
                            </h4>
                          </CardHeader>
                          <CardBody>
                            <GridItem>
                              {addServiceDate
                                ? (
                                  <Button
                                    justIcon
                                    round
                                    color="secondary"
                                    onClick={event => this.handleAddServiceDate()}
                                    className={classes.button}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                )
                                : (
                                  <Button
                                    justIcon
                                    round
                                    color="secondary"
                                    onClick={event => this.handleAddServiceDate()}
                                    className={classes.button}
                                  >
                                    <AddIcon />
                                  </Button>
                                )
                              }
                            </GridItem>
                            <GridItem lg={6} md={6} sm={12} xs={12}>
                              {addServiceDate === true && (
                                <GridContainer>
                                  <GridItem lg={6} md={6} sm={12} xs={12}>
                                    <InputLabel className={classes.label}><FormattedMessage id="form.day.start" /></InputLabel>
                                    <br />
                                    <FormControl fullWidth>
                                      <Datetime
                                        timeFormat={false}
                                        inputProps={{
                                          placeholder: 'MM/DD/YYYY',
                                          id: 'startDate',
                                          name: 'startDate',
                                        }}
                                        onChange={event => this.handleEditSingleObject('serviceDate', 'startDate', event)}
                                        value={serviceDate.startDate}
                                        locale="en"
                                      />
                                      <FormHelperText error={startDateError.length > 0}>{startDateError}</FormHelperText>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem lg={6} md={6} sm={12} xs={12}>
                                    <InputLabel className={classes.label}><FormattedMessage id="form.day.end" /></InputLabel>
                                    <br />
                                    <FormControl fullWidth>
                                      <Datetime
                                        timeFormat={false}
                                        inputProps={{
                                          placeholder: 'MM/DD/YYYY',
                                          name: 'endDate',
                                          id: 'endDate',
                                        }}
                                        name="endDate"
                                        id="endDate"
                                        onChange={event => this.handleEditSingleObject('serviceDate', 'endDate', event)}
                                        value={serviceDate.endDate}
                                        locale="en"
                                      />
                                      <FormHelperText error={endDateError.length > 0}>{endDateError}</FormHelperText>
                                    </FormControl>
                                  </GridItem>
                                </GridContainer>
                              )}
                            </GridItem>
                          </CardBody>
                        </Card>
                      </GridItem>
                      <GridItem lg={6} md={6} sm={12} xs={12}>
                        <Card>
                          <CardHeader color="rose" icon>
                            <CardIcon color="rose">
                              <AvTimer />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}>
                              <FormattedMessage id="form.time" />
                              (<FormattedMessage id="form.optional" />)
                            </h4>
                          </CardHeader>
                          <CardBody>
                            {serviceHoursCount < 7 && (
                              <Button
                                justIcon
                                round
                                color="secondary"
                                onClick={event => this.handleAddObject('serviceHours', serviceHoursObject)}
                              >
                                <AddIcon />
                              </Button>
                            )}
                            {serviceHours.map((member, index) => (
                              <React.Fragment key={index}>
                                <GridContainer>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <FormControl
                                      fullWidth
                                      className={classes.selectFormControl}
                                    >
                                      <InputLabel
                                        htmlFor="simple-select"
                                        className={classes.selectLabel}
                                      >
                                        <FormattedMessage id="form.select.day" />
                                      </InputLabel>
                                      <Select
                                        MenuProps={{
                                          className: classes.selectMenu,
                                        }}
                                        classes={{
                                          select: classes.select,
                                        }}
                                        value={member.serviceDay}
                                        inputProps={{
                                          name: 'serviceDay',

                                        }}
                                        id="serviceDay"
                                        onChange={this.handleEditObjectServiceDay('serviceHours', index)}
                                        name="serviceDay"
                                        select
                                        label="ServiceDay"
                                        fullWidth
                                        helperText={this.objectErrorText('serviceHoursError', index, 'serviceDay')}
                                        error={this.objectErrorText('serviceHoursError', index, 'serviceDay').length > 0}
                                      >
                                        <MenuItem
                                          disabled
                                          classes={{
                                            root: classes.selectMenuItem,
                                          }}
                                        >
                                          Choose Day
                                        </MenuItem>
                                        {dayOfTheWeek.map(option => (
                                          <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                    <FormHelperText error={this.objectErrorText('serviceHoursError', index, 'serviceDay').length > 0}>{this.objectErrorText('serviceHoursError', index, 'serviceDay')}</FormHelperText>
                                  </GridItem>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <InputLabel className={classes.label}><FormattedMessage id="form.time.start" /></InputLabel>
                                    <br />
                                    <FormControl fullWidth>
                                      <Datetime
                                        dateFormat={false}
                                        inputProps={{
                                          placeholder: 'HH:MM AM/PM',
                                          id: 'startTime',
                                          name: 'startTime',
                                          value: member.startTime,
                                          onChange: event => this.handleEditObject('serviceHours', 'startTime', index, event),
                                        }}
                                        formControlProps={{
                                          fullWidth: true,
                                        }}
                                        id="startTime"
                                        name="startTime"
                                        onChange={event => this.handleEditObject('serviceHours', 'startTime', index, event)}
                                        value={member.startTime}
                                        helperText={this.objectErrorText('serviceHoursError', index, 'startTime')}
                                        error={this.objectErrorText('serviceHoursError', index, 'startTime').length > 0}
                                        locale="en"
                                      />
                                      <FormHelperText error={this.objectErrorText('serviceHoursError', index, 'startTime').length > 0}>{this.objectErrorText('serviceHoursError', index, 'startTime')}</FormHelperText>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem lg={4} md={4} sm={12} xs={12}>
                                    <InputLabel className={classes.label}><FormattedMessage id="form.time.end" /></InputLabel>
                                    <br />
                                    <FormControl fullWidth>
                                      <Datetime
                                        dateFormat={false}
                                        inputProps={{
                                          placeholder: 'HH:MM AM/PM',
                                        }}
                                        id="endTime"
                                        name="endTime"
                                        value={member.endTime}
                                        onChange={event => this.handleEditObject('serviceHours', 'endTime', index, event)}
                                        helperText={this.objectErrorText('serviceHoursError', index, 'endTime')}
                                        error={this.objectErrorText('serviceHoursError', index, 'endTime').length > 0}
                                        locale="en"
                                      />
                                      <FormHelperText error={this.objectErrorText('serviceHoursError', index, 'endTime').length > 0}>{this.objectErrorText('serviceHoursError', index, 'endTime')}</FormHelperText>
                                    </FormControl>
                                  </GridItem>
                                  <GridItem lg={12} md={12} sm={12} xs={12}>
                                    <InputLabel className={classes.label} />
                                    <br />
                                    <Button
                                      justIcon
                                      round
                                      color="secondary"
                                      aria-label="Delete"
                                      onClick={event => this.handleRemoveObject('serviceHours', index, event)}
                                      className={classes.button}
                                    >
                                      <DeleteIcon />
                                    </Button>
                                  </GridItem>
                                </GridContainer>
                              </React.Fragment>))}
                          </CardBody>
                        </Card>
                      </GridItem>
                    </GridContainer>
                    {!editMode ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={event => this.handleSubmit(event)}
                        className={classes.button}
                      >
                        <FormattedMessage id="form.create" />
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={this.autoCloseAlert.bind(this)}
                        className={classes.button}
                      >
                        <FormattedMessage id="form.edit" />
                      </Button>
                    )}
                    <Clearfix />
                  </form>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </React.Fragment>
    );
  }
}

ServiceForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  intl: intlShape.isRequired,
};

export default withStyles(styles)(injectIntl(ServiceForm));
