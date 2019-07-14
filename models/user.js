const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: String
});

// On Save Hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function(next) {
  // Get access to the user model
  const user = this;

  // Generate a salt then run callbak
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    // Hash our password using the salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      // Overwrite plain text password with encrypted one
      user.password = hash;

      // Save the model
      next();
    });
  });
});

// Create the model class
const User = mongoose.model('user', userSchema);

// Export the model
module.exports = User;
