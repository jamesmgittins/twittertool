var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var searchHistory = mongoose.model('searchhistory',{query:String,time:Date});
var user = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  searchHistory.find().sort('-time').limit(3).exec(function(err, results){
	  res.render('index', { result:req.session.result, history:results });
  });
});

router.post('/testpost', function(req, res, next){

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

router.post('/login-email', function(req, res, next){
  user.find({email:req.body.email}).exec(function(err, results){
    if (!results || results.length == 0) {
      console.log('no user found - creating one')
      var aUser = new user({email:req.body.email,logInSecret:{key:'ABC123'}});
      aUser.save(function(err, aUser){
        res.render('fragments/loginmodal', {fragment:true,email:req.body.email});
      });
    } else {
      res.render('fragments/loginmodal', {fragment:true,email:req.body.email});
    }
  });
});

router.post('/login-code', function(req, res){
  res.render('fragments/loginmodal', {fragment:true,email:req.body.email});
});

module.exports = router;
