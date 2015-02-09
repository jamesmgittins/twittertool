var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var searchHistory = mongoose.model('searchhistory',{query:String,time:Date});

/* GET home page. */
router.get('/', function(req, res, next) {
  searchHistory.find().sort('-time').limit(3).exec(function(err, results){
	  res.render('index', { result:req.session.result, csrfToken:req.csrfToken(), history:results });
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
  
})

module.exports = router;
