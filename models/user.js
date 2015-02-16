var mongoose = require('mongoose');

var user = mongoose.model('User',{
	email:String,
  password:String,
	logInSecret:{key:String,timestamp:{type:Date,default:Date.now}},
	failedLogins:[{time:Date}]
});

module.exports = user;