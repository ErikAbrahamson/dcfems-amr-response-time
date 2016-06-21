var debug = require('debug')('passport-mongo'),
    app = require('./app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('DCGov local app started, listneing on ' + server.address().port);
});
