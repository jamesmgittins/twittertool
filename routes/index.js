var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var searchHistory = mongoose.model('searchhistory',{query:String,time:Date});
var user = require('../models/user');

/* GET home page. */
router.get('/', function(req, res) {
  searchHistory.find().sort('-time').limit(3).exec(function(err, results){
	  res.render('index', { result:req.session.result, history:results });
  });
});

router.post('/testpost', function(req, res){

  twitterClient.get('search/tweets',{q:req.body.text,count:100},function(error,tweets,response){
  	if (error)
  		return res.status(500);

  	req.session.result = tweets.statuses;
  	
  	new searchHistory({query:req.body.text,time:Date.now()}).save(function(err){
  		if (err)
  			console.log(err);
  	});

  	res.redirect('/');
  });
});

router.post('/login', function(req, res){
  user.find({email:req.body.email}).exec(function(err, results){
    if (!results || results.length == 0) {
      res.render('index', {logInError:'email-not-found',logInEmail:req.body.email});
    } else if (results[0].password != req.body.password) {
      res.render('index', {logInError:'bad-password', logInEmail:req.body.email});
      results[0].failedLogins.push({time:Date.now()});
      results[0].save(function(err, user){
        err && console.log(err);
      });      
    } else {
      req.session.user = results[0];
      res.redirect('/');
    }
  });
});

router.get('/new-user',function(req, res){
  var aUser = new user({email:req.session.email,logInSecret:{key:'ABC123'}});
  aUser.save(function(err, aUser){
    res.render('fragments/loginmodal', {fragment:'email-found',email:req.session.email});
  });
});

router.get('/logout',function(req,res){
  req.session.user = null;
  res.redirect('/');
});

router.post('/register', function(req, res){
  user.find({email:req.body.email}).exec(function(err, results){
    if (results && results.length > 0) {
      res.render('index', {regError:'email-already-used',regEmail:req.body.email});
    } else {
      if (req.body.password != req.body.password_confirm) {
        res.render('index', {regError:'password-mismatch',regEmail:req.body.email});
        return;
      }
      var aUser = new user({email:req.body.email,password:req.body.password,logInSecret:{key:'ABC123'}});
      aUser.save(function(err, aUser){
        res.render('fragments/loginmodal', {fragment:'email-found',email:req.session.email});
      });
    }
  });
});

module.exports = router;
