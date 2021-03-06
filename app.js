var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var mongoose = require('mongoose');
var app = express();
if (app.get('env') === 'development')
    mongoose.connect('mongodb://' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/twittertool');
else
    mongoose.connect('mongodb://admin:fSJjWvp3lTqJ@' + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' + process.env.OPENSHIFT_MONGODB_DB_PORT + '/twittertool');

var MongooseSessionStore = require('express-mongoose-store')(session,mongoose);


var twitter = require('twitter');
twitterClient = new twitter({
    consumer_key:'FtvpzvtKENDANmEdOBJ6LizpZ',
    consumer_secret:'hhGKdTiFEvr9APiEjEZp1H6EfzoHNa14gVSYxiqluxvwuU0Mp8',
    access_token_key:'',
    access_token_secret:''});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret:'ATYXLSNDF348732459ANFKAgGgRrR',
    store: new MongooseSessionStore({ttl:2400000}),
    resave:false,
    saveUninitialized:true,
    cookie:{httpOnly:true,maxAge:3600000}}));

app.use(csrf());
app.use(express.static(path.join(__dirname, 'public')));

// Used to add general things for each request
app.use(function (req, res, next) {
  res.locals.csrf=req.csrfToken();
  res.locals.user=req.session.user;
  next();
})

// specific route handlers
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
app.use('/search', require('./routes/search'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
