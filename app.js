"use strict";
let express             = require('express'),
    path                = require('path'),
    favicon             = require('serve-favicon'),
    logger              = require('morgan'),
    bodyParser          = require('body-parser'),
    cookieParser        = require('cookie-parser'),
    indexController     = require('./api/controllers/indexController'),
    userController      = require('./api/controllers/userController'),
    loginController     = require('./api/controllers/loginController'),
    registerController  = require('./api/controllers/registerController'),
    passport            = require('passport'),
    LocalStrategy       = require('passport-local').Strategy,
    session             = require('express-session'),
    mongoose            = require('mongoose'),
    app                 = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//Secret value is a string that should be kept secret and unique per application
app.use(session({
  secret : 'learn mongoose',
  resave : true,
  saveUninitialized : false
}));

//passport configuration
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'assets')));
mongoose.connect('mongodb://localhost/mongoosetest');

app.use('/',         indexController);
app.use('/user',     userController);
app.use('/login',    loginController);
app.use('/register', registerController);

var User = global.User = require('./api/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// catch 404 and forward to error handler
app.use( (req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use( (err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use( (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
