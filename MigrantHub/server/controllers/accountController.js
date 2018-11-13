const qs = require('qs');
const bcrypt = require('bcryptjs');
const User = require('../models/MigrantUser');
const BusinessUser = require('../models/BusinessUser');
const Admin = require('../models/Admin');
const BusinessAccountValidator = require('../validators/BusinessAccountValidator');
const MigrantAccountValidator = require('../validators/MigrantAccountValidator');
const AdminAccountValidator = require('../validators/AdminAccountValidator');


module.exports = {
  createUser(req, res) {
    const parsedObj = qs.parse(req.body);
    const errors = MigrantAccountValidator(parsedObj);

    if (errors === '') {
      const user = new User();
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(parsedObj.password, salt);

      user._id = parsedObj.email;
      user.email = parsedObj.email;
      user.password = hash;

      user.firstName = parsedObj.firstName;
      user.lastName = parsedObj.lastName;
      user.address = parsedObj.address;
      user.apartment = parsedObj.apartment;
      user.city = parsedObj.city;
      user.province = parsedObj.province;
      user.postalCode = parsedObj.postalCode;
      user.phoneNumber = parsedObj.phoneNumber;
      user.age = parsedObj.age;
      user.gender = parsedObj.gender;
      user.nationality = parsedObj.nationality;
      user.relationshipStatus = parsedObj.relationshipStatus;
      user.status = parsedObj.status;
      user.languages = parsedObj.languages;
      user.writingLevel = parsedObj.writingLevel;
      user.speakingLevel = parsedObj.speakingLevel;
      user.motherTongue = parsedObj.motherTongue;
      user.family = parsedObj.family;
      user.educationLevel = parsedObj.educationLevel;
      user.proficiencyExams = parsedObj.proficiencyExams;
      user.jobStatus = parsedObj.jobStatus;
      user.lookingForJob = parsedObj.lookingForJob;
      user.currentIncome = parsedObj.currentIncome;
      user.workExperience = parsedObj.workExperience;
      user.settlingLocation = parsedObj.settlingLocation;
      user.settlingDuration = parsedObj.settlingDuration;
      user.joiningReason = parsedObj.joiningReason;
      user.save((err) => {
        if (err) {
          return res.send('There was a error saving user.');
        }
        return res.send('User has been added!');
      });
    } else {
      return res.send(errors);
    }
  },

  createBusiness(req, res) {
    const parsedObj = qs.parse(req.body);
    const errors = BusinessAccountValidator(parsedObj);

    if (errors === '') {
      const businessuser = new BusinessUser();
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(parsedObj.password, salt);

      businessuser._id = parsedObj.email;
      businessuser.email = parsedObj.email;
      businessuser.password = hash;

      businessuser.corpId = parsedObj.corpId;
      businessuser.firstName = parsedObj.firstName;
      businessuser.lastName = parsedObj.lastName;
      businessuser.address = parsedObj.address;
      businessuser.apartment = parsedObj.apartment;
      businessuser.city = parsedObj.city;
      businessuser.province = parsedObj.province;
      businessuser.postalCode = parsedObj.postalCode;
      businessuser.phoneNumber = parsedObj.phoneNumber;
      businessuser.organizationName = parsedObj.organizationName;
      businessuser.orgType = parsedObj.orgType;
      businessuser.department = parsedObj.department;
      businessuser.serviceType = parsedObj.serviceType;
      businessuser.description = parsedObj.description;
      businessuser.save((err) => {
        if (err) {
          return res.send('There was a error saving business user.');
        }
        return res.send('Business user has been added!');
      });
    } else {
      return res.send(errors);
    }
  },

  createAdmin(req, res) {
    const parsedObj = qs.parse(req.body);
    const errors = AdminAccountValidator(parsedObj);

    if (errors === '') {
      const admin = new Admin();
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(parsedObj.password, salt);

      admin._id = parsedObj.email;
      admin.email = parsedObj.email;
      admin.password = hash;

      admin.save((err) => {
        if (err) {
          return res.send('There was a error saving admin user.');
        }
        return res.send('Admin user has been added!');
      });
    } else {
      return res.send(errors);
    }
  },

  getUserType(req, res) {
    if (req.user) {
      const user = {
        email: req.user._id,
        type: req.user.type,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
      };
      return res.status(200).send(user);
    }
    return res.status(404).send('Error retrieving user');
  },

  getUser(req, res) {
    if (req.user) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  },
};