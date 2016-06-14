var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user.js'),
    Task = require('../models/task.js'),
    mongoose = require('mongoose-q')(require('mongoose'), { spread: true });


router.post('/register', function(req, res) {
  User.register(new User({
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
  }), req.body.password, function(error, account) {
    if (error) return res.status(500).json({ error: error });
    passport.authenticate('local')(req, res, function () {
      return res.status(200).json(account);
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(error, user, info) {
    if (error) return res.status(500).json({ error: error });
    if (!user) return res.status(401).json({ error: info });
    req.logIn(user, function(error) {
      if (error) {
        return res.status(500).json({error: 'Could not log in user'});
      }
      User.findById(user._id)
        .populate('tasks').exec(function(error, response) {
        if (error) res.json(error);
        else res.status(200).json(response);
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({status: 'Bye!'});
});

module.exports = router;
