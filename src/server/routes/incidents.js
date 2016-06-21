var express = require('express'),
    router = express.Router(),
    User = require('../models/user.js'),
    passport = require('passport'),
    Incident = require('../models/incident.js'),
    mongoose = require('mongoose-q')(require('mongoose'), { spread: true });

router.get('/user/:id/incidents', function(req, res, next) {
  User.findById(req.params.id)
    .populate('incidents').exec(function(error, user) {
    if (error) res.json(error);
    else res.json(user.incidents);
  });
});

router.post('/user/:id/incident', function(req, res, next) {
  var newIncident = new Incident({
    title: req.body.title,
    description: req.body.description,
    deadline: req.body.deadline,
    priority: req.body.priority,
    complete: req.body.complete,
    punishment_type: {
      donation: req.body.donation,
      text_message: req.body.text_message
    }
  });
    newIncident.saveQ()
      .then(function(result) {
        var update = { $push : {incidents : newIncident }}, options = {
          new: true,
          upsert: true
        }, id = req.params.id;
        User.findByIdAndUpdateQ(id, update, options)
          .then(function(result) { res.json(result); })
          .catch(function(error) { res.send(error); });
      })

      .catch(function(error) { res.send(error); })
      .done();
});

router.get('/user/:userid/incident/:incidentid', function(req, res, next) {
  var user = req.params.userid, incident = req.params.incidentid;
  User.findByIdQ(user)
    .then(function(result) {
      Incident.findByIdQ(incident)
        .then(function(result) { res.json(result); });
    })
    .catch(function(error) {
      res.send(error);
    }).done();
});

router.put('/user/:userid/incident/:incidentid', function(req, res, next) {
  var user = req.params.userid, incident = req.params.incidentid,
    options = { new: true };
  User.findByIdQ(user)
    .then(function(result) {
      Incident.findOneAndUpdateQ(incident, req.body, options)
        .then(function(result) { res.json(result); });
    })
    .catch(function(error) {
      res.send(error);
    }).done();
});

router.delete('/user/:userid/incident/:incidentid', function(req, res, next) {
  var user = req.params.userid, incident = req.params.incidentid;
  User.findByIdQ(user)
    .then(function(result) {
      Incident.findByIdAndRemoveQ(incident)
        .then(function(result) { res.json(result); });
    })
    .catch(function(error) {
      res.send(error);
    }).done();
});

module.exports = router;
