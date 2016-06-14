var mongoURI = {
  development: 'mongodb://localhost/capstone',
  test: 'mongodb://localhost/capstone-test',
  production: process.env.MONGOLAB_URI
};

var config = { MONGO_URI: mongoURI };

module.exports = config;
