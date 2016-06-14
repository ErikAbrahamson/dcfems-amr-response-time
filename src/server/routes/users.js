var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user.js'),
    mongoose = require('mongoose-q')(require('mongoose'), { spread: true });

router.get('/users', function(req, res, next) {
  User.findQ()
    .then(function(result) { res.json(result); })
    .catch(function(error) { res.send(error); })
    .done();
});

router.get('/user/:id', function(req, res, next) {
  var query = {'_id': req.params.id};
  User.findByIdQ(query)
    .then(function(result) { res.json(result); })
    .catch(function(error) { res.send(error); })
    .done();
});

router.put('/user/:id', function(req, res, next) {
  var query = { '_id': req.params.id }, options = { new: true };
  User.findOneAndUpdateQ(query, req.body, options)
    .then(function(result) { res.json(result); })
    .catch(function(error) { res.send(error); })
    .done();
});

router.delete('/user/:id', function(req, res, next) {
  User.findByIdAndRemoveQ(req.params.id)
    .then(function(result) { res.json(result); })
    .catch(function(error) { res.json(error); })
    .done();
});

module.exports = router;
