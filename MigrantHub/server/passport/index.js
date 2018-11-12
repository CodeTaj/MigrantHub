const passport = require('passport');
const LocalStrategy = require('./LocalStrategy');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, {
    _id: user._id, type: user.type, firstName: user.firstName, lastName: user.lastName,
  });
});

passport.deserializeUser((user, done) => {
  User.findOne(
    { _id: user._id },
    { type: true, lastName: true, firstName: true },
    (err, foundUser) => {
      done(null, foundUser);
    },
  );
});

passport.use(LocalStrategy);
module.exports = passport;
