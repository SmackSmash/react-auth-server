const Authentication = require('./controllers/authentication');

module.exports = app => {
  app.post('/', Authentication.signup);
};
