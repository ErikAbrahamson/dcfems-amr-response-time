var mongoURI = {
  development: 'mongodb://localhost/dcgov',
  test: 'mongodb://localhost/dcgov-test',
  production: process.env.MONGOLAB_URI
};

var config = { MONGO_URI: mongoURI };

module.exports = config;
