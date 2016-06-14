var express = require('express'),
    router = express.Router(),
    User = require('../models/user.js'),
    passport = require('passport'),
    Task = require('../models/task.js'),
    mongoose = require('mongoose-q')(require('mongoose'), { spread: true });

router.get('/user/:id/tasks', function(req, res, next) {
  User.findById(req.params.id)
    .populate('tasks').exec(function(error, user) {
    if (error) res.json(error);
    else res.json(user.tasks);
  });
});

router.post('/user/:id/task', function(req, res, next) {
  var newTask = new Task({
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
    newTask.saveQ()
      .then(function(result) {
        var update = { $push : {tasks : newTask }}, options = {
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

router.get('/user/:userid/task/:taskid', function(req, res, next) {
  var user = req.params.userid, task = req.params.taskid;
  User.findByIdQ(user)
    .then(function(result) {
      Task.findByIdQ(task)
        .then(function(result) { res.json(result); });
    })
    .catch(function(error) {
      res.send(error);
    }).done();
});

router.put('/user/:userid/task/:taskid', function(req, res, next) {
  var user = req.params.userid, task = req.params.taskid,
    options = { new: true };
  User.findByIdQ(user)
    .then(function(result) {
      Task.findOneAndUpdateQ(task, req.body, options)
        .then(function(result) { res.json(result); });
    })
    .catch(function(error) {
      res.send(error);
    }).done();
});

router.delete('/user/:userid/task/:taskid', function(req, res, next) {
  var user = req.params.userid, task = req.params.taskid;
  User.findByIdQ(user)
    .then(function(result) {
      Task.findByIdAndRemoveQ(task)
        .then(function(result) { res.json(result); });
    })
    .catch(function(error) {
      res.send(error);
    }).done();
});

module.exports = router;
