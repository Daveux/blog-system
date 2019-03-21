let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let session = require('express-session');
let multer = require('multer');
let moment = require('moment');
let expressValidator = require('express-validator');

let db = require('monk')('localhost/blog-system');

// let routes = require('./routes/index');
// let users = require('./routes/users')


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      let namespace = param.split('.')
          , root = namespace.shift()
          , formParam = root;
      while (namespace.length) {
        form
      }
    }
}));
//Connect-Flash
app.use(flash());
app.use(function(req, res, next){
  res.locals.messages =require('express-messages')(req,res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
app.use(function(req, res, next){
  req.db = db;
  next();
});

module.exports = app;
