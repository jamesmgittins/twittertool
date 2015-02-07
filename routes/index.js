var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { result:req.session.result, csrfToken:req.csrfToken() });
});

router.post('/testpost', function(req, res){

  twitterClient.get('search/tweets',{q:req.body.text,count:100},function(error,tweets,response){
  	if (error)
  		return res.status(500);

  	req.session.result = tweets.statuses;
  	res.redirect('/');
  });
  
})

module.exports = router;
