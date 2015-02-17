var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var searchHistory = mongoose.model('searchhistory',{query:String,time:Date});
var user = require('../models/user');

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'jamesmgittins@gmail.com',
        pass: 'obl1v1on'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Twittertool ✔ <twittertool@jamesgittins.com>', // sender address
    to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    subject: 'Password Reset ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world ✔</b>' // html body
};

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
      req.session.email=req.body.email;
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

router.get('/reset-password',function(req, res){
  user.find({email:req.session.email}).exec(function(err, results){
    res.render('index', {logInInfo:'password-reset-email-sent',logInEmail:req.session.email});
    // send mail with defined transport object
    mailOptions.to = req.session.email;
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
        console.log(error);
      }else{
        console.log('Message sent: ' + info.response);
      }
    });
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
      var aUser = new user({email:req.body.email,password:req.body.password,logInSecret:{key:Date.now()},activated:false});
      aUser.sysAdmin = aUser.email == "jamesmgittins@gmail.com";
      aUser.save(function(err, aUser){
        res.render('index', {regInfo:'account-created'});
      });
    }
  });
});

module.exports = router;
