var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var Incident = new Schema({
  title: { type: String },
  description: { type: String },
  deadline: { type: Date },
  priority: { type: Number },
  complete: { type: String },
  punishment_type: {
    donation: { type: Boolean },
    text_message: { type: Boolean }
  }
});

Incident.plugin(passportLocalMongoose);
module.exports = mongoose.model('incidents', Incident);
