const jwt = require('jwt-simple');
const { secret } = require('../config');
const User = require('../models/user');

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, secret);
};

exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  // Validate email and password
  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide an email and a password' });
  }

  if (email.split('@').length !== 2 || email.split('@')[1].split('.').length !== 2) {
    return res.status(422).send({ error: 'You must provide a valid email' });
  }

  // Check if user with fiven email aleady exists
  User.findOne({ email }, (err, existingUser) => {
    if (err) return next(err);

    // If user already exists return an error
    if (existingUser) res.status(422).send({ error: 'Email is in use' });
  });

  // If user doesn't exist, create and save user record
  const user = new User({ email, password });

  user.save(err => {
    if (err) return next(err);

    // Respond to request indicating user was created
    res.json({ token: tokenForUser(user) });
  });
};
