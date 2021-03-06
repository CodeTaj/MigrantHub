import validator from 'validator';
import axios from 'axios';

const checkEmailTaken = async (email) => {
  try {
    const response = await axios.head(`/api/accounts/${email}`);
    if (response.status === 200) {
      return true;
    }
  } catch (e) {
    if (e.response.status === 404) {
      return false;
    }
  }
};

const validateCorpId = async (corpId) => {
  const urlForIdValidation = `https://www.ic.gc.ca/app/scr/cc/CorporationsCanada/api/corporations/${corpId}.json?lang=eng`;
  const response = await fetch(urlForIdValidation);
  const json = await response.json();
  if (json[0] === `could not find corporation ${corpId}`) {
    return false;
  }
  return true;
};

const rules = {
  email: [
    {
      field: 'email',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Email is required',
    },
    {
      field: 'email',
      method: validator.isEmail,
      validWhen: true,
      message: 'Email is not valid',
    },
  ],
  get emailSignup() {
    const additionalRules = [{
      field: 'email',
      method: checkEmailTaken,
      validWhen: false,
      message: 'Email already taken',
    }];
    return this.email.concat(additionalRules);
  },
  password: [
    {
      field: 'password',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Password is required',
    },
  ],
  get passwordSignup() {
    const additionalRules = [{
      field: 'password',
      method: validator.isLength,
      args: [{ min: 8 }],
      validWhen: true,
      message: 'Password must be 8 characters',
    }];
    return this.password.concat(additionalRules);
  },
  firstName: [
    {
      field: 'firstName',
      method: validator.isEmpty,
      validWhen: false,
      message: 'First name is required',
    },
    {
      field: 'firstName',
      method: validator.isAlpha,
      validWhen: true,
      message: 'First name is not valid',
    },
  ],
  lastName: [
    {
      field: 'lastName',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Last name is required',
    },
    {
      field: 'lastName',
      method: validator.isAlpha,
      validWhen: true,
      message: 'Last name is not valid',
    },
  ],
  age: [
    {
      field: 'age',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Age is required',
    },
    {
      field: 'age',
      method: validator.isInt,
      args: [{ min: 1, max: 100 }],
      validWhen: true,
      message: 'Age is not valid',
    },
  ],
  gender: [
    {
      field: 'gender',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Gender is required',
    },
  ],
  nationality: [
    {
      field: 'nationality',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Nationality is required',
    },
    {
      field: 'nationality',
      method: validator.isAlpha,
      validWhen: true,
      message: 'Nationality is not valid',
    },
  ],
  relationshipStatus: [
    {
      field: 'relationshipStatus',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Relationship status is required',
    },
  ],
  status: [
    {
      field: 'status',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Status is required',
    },
  ],
  educationLevel: [
    {
      field: 'educationLevel',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Education level is required',
    },
  ],
  jobStatus: [
    {
      field: 'jobStatus',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Job status is required',
    },
  ],
  settlingLocation: [
    {
      field: 'settlingLocation',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Settling location is required',
    },
  ],
  joiningReason: [
    {
      field: 'joiningReason',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Joining reason is required',
    },
  ],
  corpId: [
    {
      field: 'corpId',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Corporation Id is required',
    },
    {
      field: 'corpId',
      method: validator.isNumeric,
      validWhen: true,
      message: 'Corporation Id must be a 7 digit number',
    },
    {
      field: 'corpId',
      method: validateCorpId,
      validWhen: true,
      message: 'Corporation Id is not valid',
    },
  ],
  address: [
    {
      field: 'address',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Address is required',
    },
  ],
  city: [
    {
      field: 'city',
      method: validator.isEmpty,
      validWhen: false,
      message: 'City is required',
    },
    {
      field: 'city',
      method: validator.isAlpha,
      validWhen: true,
      message: 'City is not valid',
    },
  ],
  province: [
    {
      field: 'province',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Province is required',
    },
  ],
  postalCode: [
    {
      field: 'postalCode',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Postal code is required',
    },
    {
      field: 'postalCode',
      method: validator.isLength,
      args: [{ min: 7, max: 7 }],
      validWhen: true,
      message: 'Postal code is not valid',
    },
  ],
  phoneNumber: [
    {
      field: 'phoneNumber',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Phone number is required',
    },
    {
      field: 'phoneNumber',
      method: validator.isLength,
      args: [{ min: 14, max: 14 }],
      validWhen: true,
      message: 'Phone number is not valid',
    },
  ],
  organizationName: [
    {
      field: 'organizationName',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Organization name is required',
    },
  ],
  orgType: [
    {
      field: 'orgType',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Organization type is required',
    },
  ],
  department: [
    {
      field: 'department',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Department name is required',
    },
  ],
  serviceType: [
    {
      field: 'serviceType',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Service type is required',
    },
  ],
  title: [
    {
      field: 'title',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Title is required',
    },
  ],
  description: [
    {
      field: 'description',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Description is required',
    },
  ],
  get login() {
    return this.email.concat(this.password);
  },
  get migrantSignupStep1() {
    const rule = this.emailSignup
      .concat(this.passwordSignup)
      .concat(this.firstName)
      .concat(this.lastName);
    return rule;
  },
  get migrantSignupStep2() {
    const rule = this.age
      .concat(this.gender)
      .concat(this.nationality)
      .concat(this.relationshipStatus)
      .concat(this.status);
    return rule;
  },
  get migrantSignupStep3() {
    const rule = this.educationLevel
      .concat(this.jobStatus)
      .concat(this.settlingLocation)
      .concat(this.joiningReason);
    return rule;
  },
  get migrantSignup() {
    const rule = this.migrantSignupStep1
      .concat(this.migrantSignupStep2)
      .concat(this.migrantSignupStep3);
    return rule;
  },
  get businessSignupStep1() {
    const rule = this.emailSignup
      .concat(this.passwordSignup)
      .concat(this.firstName)
      .concat(this.lastName);
    return rule;
  },
  get businessSignupStep2() {
    return this.corpId;
  },
  get businessSignupStep3() {
    const rule = this.address
      .concat(this.city)
      .concat(this.province)
      .concat(this.postalCode)
      .concat(this.phoneNumber);
    return rule;
  },
  get businessSignupStep4() {
    const rule = this.organizationName
      .concat(this.orgType)
      .concat(this.department)
      .concat(this.serviceType)
      .concat(this.description);
    return rule;
  },
  get businessSignup() {
    const rule = this.businessSignupStep1
      .concat(this.businessSignupStep2)
      .concat(this.businessSignupStep3)
      .concat(this.businessSignupStep4);
    return rule;
  },
  get adminSignup() {
    const rule = this.emailSignup
      .concat(this.passwordSignup);
    return rule;
  },
  rating: [
    {
      field: 'rating',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Rating is required',
    },
    {
      field: 'rating',
      method: validator.isInt,
      args: [{ min: 1, max: 5 }],
      validWhen: true,
      message: 'Rating is not valid',
    },
  ],
  comment: [
    {
      field: 'comment',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Comment is required',
    },
  ],
  get reviewPost() {
    const rule = this.rating
      .concat(this.comment);
    return rule;
  },
  get createBug() {
    const rule = this.title
      .concat(this.description);
    return rule;
  },
  descriptionLength: [
    {
      field: 'descriptionLength',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Description is required',
    },
    {
      field: 'descriptionLength',
      method: validator.isInt,
      args: [{ min: 10 }],
      validWhen: true,
      message: 'Description is too short',
    },
  ],
  positionType: [
    {
      field: 'positionType',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Position Type is required',
    },
  ],
  location: [
    {
      field: 'location',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Location is required',
    },
  ],
  companyName: [
    {
      field: 'companyName',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Company name is required',
    },
  ],
  contactName: [
    {
      field: 'contactName',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Contact name is required',
    },
  ],
  contactEmail: [
    {
      field: 'contactEmail',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Contact email is required',
    },
    {
      field: 'contactEmail',
      method: validator.isEmail,
      validWhen: true,
      message: 'Contact email is not valid',
    },
  ],
  contactPhone: [
    {
      field: 'contactPhone',
      method: validator.isEmpty,
      validWhen: false,
      message: 'Contact phone number is required',
    },
    {
      field: 'contactPhone',
      method: validator.isLength,
      args: [{ min: 14, max: 14 }],
      validWhen: true,
      message: 'Contact phone number is not valid',
    },
  ],
  get jobFormStep1() {
    const rule = this.title
      .concat(this.positionType)
      .concat(this.location);
    return rule;
  },
  get jobFormStep2() {
    return this.descriptionLength;
  },
  get jobFormStep3() {
    const rule = this.companyName
      .concat(this.contactName)
      .concat(this.contactEmail)
      .concat(this.contactPhone);
    return rule;
  },
  get jobFormCreate() {
    const rule = this.jobFormStep1
      .concat(this.jobFormStep2)
      .concat(this.jobFormStep3);
    return rule;
  },
};

export default rules;
