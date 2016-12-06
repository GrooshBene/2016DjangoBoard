var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var randomString = require('randomstring');
var serveStatic = require('serve-static');
var path = require('path');
var schema = mongoose.Schema;
var ArticleSchema = new schema({
    _id : String,
    title : String,
    rare_content : String,
    content : String
});
var UserSchema = new schema({
    _id : String,
    email : String,
    name : String
})

var Article = mongoose.model('articles', ArticleSchema);
var User = mongoose.model('users', UserSchema);
mongoose.connect("mongodb://localhost:27017/wiki", function (err) {
    if(err){
        console.log("MongoDB Error");
        throw err;
    }
});
var app = express();

var session = require('express-session');
var sessionStore = require('sessionstore');
store = sessionStore.createSessionStore();

app.use(session({
    store :store,
    secret : 'grooshbene',
    cookie : {
        path : '/',
        expires : false
    }
}));

app.use(serveStatic(__dirname, ({
    'index' : false
})));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var users = require('./routes/users');

// app.use('/', index);
app.use('/users', users);

require('./routes/w')(app, Article, randomString, path);
require('./routes/auth')(app, User, randomString, path);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
