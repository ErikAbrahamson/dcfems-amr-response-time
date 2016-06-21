process.env.NODE_ENV = 'test';

var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server/app.js');
var mongoose = require('mongoose-q')(require('mongoose'));
var Incident = require('../../src/server/models/incident.js');
var User = require('../../src/server/models/user.js');

var should = chai.should();
chai.use(chaiHttp);

describe('User Incidents', function() {

  beforeEach(function(done) {

    Incident.collection.drop();
    User.collection.drop();
    var date = new Date();
    date = date.setDate(15);

    var newIncident = new Incident({
      title: 'Finish Tests',
      description: 'I\'d better finish these tests',
      deadline: date,
      priority: 10,
      complete: false,
      severity: 10,
      punishment_type : {
        donation: true,
        text_message: false
      }
    });
    newIncident.save();
    var newUser = new User({
      username: 'test@test.com',
      password: 'test',
      email: 'test@test.com',
      phone: '123-456-7890',
      incidents:[newIncident]
    });

    newUser.save();
    done();
  });


  afterEach(function(done) {
    User.collection.drop();
    Incident.collection.drop();
    done();
  });

  it('Should return all incidents for a user', function(done) {
    var date = new Date();
    date = date.setDate(15);
    chai.request(server).get('/users/')
      .end(function(err, res) {
        chai.request(server)
          .get('/user/' + res.body[0]._id + '/incidents/')
          .end(function(error, res) {
            res.should.have.status(200);
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('_id');
            res.body[0].should.have.property('title');
            res.body[0].should.have.property('description');
            res.body[0].should.have.property('deadline');
            res.body[0].should.have.property('priority');
            res.body[0].should.have.property('complete');
            res.body[0].should.have.property('punishment_type');
            res.body[0].punishment_type.should.have.property('donation');
            res.body[0].punishment_type.should.have.property('text_message');
            res.body[0].title.should.equal('Finish Tests');
            res.body[0].priority.should.equal(10);
            done();
          });
      });
  });

  it('Should return a single incident from a user', function(done) {
    chai.request(server)
      .get('/users/').end(function(error, res) {
        chai.request(server)
          .get('/user/' + res.body[0]._id + '/incident/' + res.body[0].incidents[0])
          .end(function(error, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('deadline');
            res.body.should.have.property('priority');
            res.body.should.have.property('complete');
            res.body.should.have.property('punishment_type');
            res.body.punishment_type.should.have.property('donation');
            res.body.punishment_type.should.have.property('text_message');
            res.body.title.should.equal('Finish Tests');
            res.body.priority.should.equal(10);
            done();
          });
      });
  });

  it('Should post a new incident into the user\'s incident list', function(done) {
    var date = new Date();
    chai.request(server)
      .get('/users/').end(function(error, res) {
        chai.request(server)
          .post('/user/' + res.body[0]._id + '/incident/')
          .send({
            'title': 'Finish Tests',
            'description': 'I\'d better finish these tests',
            'deadline': date.setDate(15),
            'priority': 10,
            'complete': false,
            'punishment_type' : {
              'donation': true,
              'text_message': false
            }
          })
          .end(function(err, res) {
            res.should.have.status(200);
            res.body.incidents.length.should.equal(2);
            done();
          });
      });
  });

  it('Should allow a user to edit incidents', function(done) {
    chai.request(server)
      .get('/users/').end(function(err, res) {
        chai.request(server)
          .put('/user/' + res.body[0]._id + '/incident/' + res.body[0].incidents[0])
          .send({
            'description': 'Finished!',
            'complete': true,
           })
          .end(function(error, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.complete.should.equal('true');
            res.body.description.should.equal('Finished!');
            done();
          });
      });
  });

  it('Should allow a user to remove a incident', function(done) {
    chai.request(server)
      .get('/users/').end(function(err, res) {
        chai.request(server)
          .delete('/user/' + res.body[0]._id + '/incident/' + res.body[0].incidents[0])
          .end(function(error, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('title');
            res.body.should.have.property('description');
            res.body.should.have.property('deadline');
            res.body.should.have.property('priority');
            res.body.should.have.property('complete');
            res.body.should.have.property('punishment_type');
            res.body.punishment_type.should.have.property('donation');
            res.body.punishment_type.should.have.property('text_message');
            res.body.title.should.equal('Finish Tests');
            res.body.priority.should.equal(10);
            done();
          });
      });
    });
});
