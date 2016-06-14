process.env.NODE_ENV = 'test';

var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../../src/server/app.js');
var Task = require('../../src/server/models/task.js');
var User = require('../../src/server/models/user.js');

var should = chai.should();
chai.use(chaiHttp);

describe('Userbase', function() {

  beforeEach(function(done) {

    Task.collection.drop();
    User.collection.drop();
    var date = new Date();
    date.setDate(date.getDate() + 10);

    var newTask = new Task({
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
    var secondTask = new Task({
      title: 'Seriously, finish tests',
      description: 'I\'d better finish these damn tests',
      deadline: date,
      priority: 10,
      complete: false,
      severity: 10,
      punishment_type : {
        donation: false,
        text_message: true
      }
    });
    var newUser = new User({
      username: 'test@test.com',
      password: 'test',
      email: 'test@test.com',
      phone: '123-456-7890',
      tasks:[newTask, secondTask]
    });
    var anotherUser = new User({
      username: 'Rick',
      password: '12345',
      email: 'test@test.com',
      phone: '123-456-7890',
      tasks: []
    });

    newTask.save();
    secondTask.save();
    newUser.save();
    anotherUser.save();
    done();

  });

  afterEach(function(done) {
    User.collection.drop();
    Task.collection.drop();
    done();
  });

  it('Should return all users and associated tasks', function(done) {
    chai.request(server)
      .get('/users/')
      .end(function(error, res) {
        res.should.have.status(200);
        res.body[0].should.have.property('_id');
        res.body[0].tasks.length.should.equal(2);
        res.body[0].should.have.property('username');
        res.body[0].should.have.property('tasks');
        res.body[0].should.have.property('_id');
        res.body[0].tasks.length.should.equal(2);
        res.body[1].should.have.property('username');
        res.body[1].should.have.property('tasks');
        res.body[1].should.have.property('_id');
        res.body[1].tasks.length.should.equal(0);
        done();
      });
  });

  it('Should return a single user and associated tasks', function(done) {
    var newUser = new User({
      username: 'test@test.com',
      password: 'test',
      phone: '123-456-7890',
      twitter: '@user',
      tasks:[]
    });
      newUser.save(function(error, response) {
        chai.request(server)
          .get('/user/' + response._id)
          .end(function(error, res) {
            res.should.have.status(200);
            res.body.should.have.property('_id');
            res.body.should.have.property('username');
            res.body.should.have.property('password');
            res.body.should.have.property('phone');
            res.body.should.have.property('tasks');
            res.body.username.should.equal('test@test.com');
            res.body.password.should.equal('test');
            res.body.phone.should.equal('123-456-7890');
            res.body.tasks.length.should.equal(0);
            done();
          });
      });
  });

  it('Should let an authenticated user log in', function(done) {
    chai.request(server).post('/user/register').send({
        'username': 'Erik',
        'password': '12345'
      })
      .end(function(err, res) {
        chai.request(server).post('/user/login/').send({
          'username': 'Erik',
          'password': '12345'
        })
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.username.should.equal('Erik');
          done();
        });
      });
  });

  it('Should let an authenticated user log out', function(done) {
    chai.request(server).get('/user/logout/')
      .send({
        'username': 'Rick',
        'password': '12345'
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.status.should.equal('Bye!');
        done();
      });
  });

  it('Should allow a user to modify their account information', function(done) {
    chai.request(server).get('/users/')
      .end(function(err, response) {
        chai.request(server)
          .put('/user/' + response.body[0]._id)
          .send({ 'username': 'Updated!' })
          .end(function(error, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('username');
            res.body.should.have.property('password');
            res.body.should.have.property('phone');
            res.body.should.have.property('tasks');
            res.body.should.have.property('email');
            res.body.username.should.equal('Updated!');
            done();
          });
      });
  });

  it('Should authenticate and add new user', function(done) {
    chai.request(server).post('/user/register').send({
        'username': 'Erik',
        'password': '12345',
        'phone': '123-456-7890',
      })
      .end(function(err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('username');
        res.body.should.have.property('salt');
        res.body.should.have.property('hash');
        res.body.should.have.property('_id');
        res.body.username.should.equal('Erik');
        res.body.phone.should.equal('123-456-7890');
        done();
      });
  });

  it('Should remove a user at the user\'s request', function(done) {
    chai.request(server).get('/users')
      .end(function(err, response) {
        chai.request(server)
          .delete('/user/' + response.body[0]._id)
          .end(function(error, res) {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            res.body.should.have.property('username');
            res.body.should.have.property('password');
            res.body.should.have.property('phone');
            res.body.should.have.property('tasks');
            res.body.should.have.property('email');
            done();
         });
    });
  });
});
