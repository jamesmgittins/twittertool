var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var sessions = mongoose.model('Session');
var users = require('../models/user');

/* Get admin page */
router.get('/', function(req, res, next) {
  res.render('admin', {});
});

/* Get admin page sessions fragment */
router.get('/sessions', function(req, res, next) {
  sessions.find().sort('session.cookie.expires').exec(function(err, results){
  	res.render('fragments/sessions', {sessions:results});
  });
});

/* Get admin page users fragment */
router.get('/users', function(req, res, next) {
  users.find().sort('email').exec(function(err,results){
    console.log(results);
    res.render('fragments/users', {users:results});
  });
});

module.exports = router;