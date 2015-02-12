var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var sessions = mongoose.model('Session');

/* Get admin page */
router.get('/', function(req, res, next) {
  res.render('admin', {});
});

/* Get admin page */
router.get('/sessions', function(req, res, next) {
  sessions.find().sort('session.cookie.expires').exec(function(err, results){
  	res.render('fragments/sessions', {sessions:results});
  });
});

/* Get admin page */
router.get('/users', function(req, res, next) {
  res.render('fragments/users', {});
});

module.exports = router;