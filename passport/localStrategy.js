const passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const Admin           = require('../models/admin-model');
const bcrypt          = require('bcrypt');

passport.use(new LocalStrategy( { usernameField: 'email' }, (email, password, next) => {
  Admin.findOne({ email }, (err, foundAdmin) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundAdmin) {
      next(null, false, { message: 'Incorrect username' });
      return;
    }

    if (!bcrypt.compareSync(password, foundAdmin.encryptedPassword)) {
      next(null, false, { message: 'Incorrect password' });
      return;
    }

    next(null, foundAdmin);
  });
}));
