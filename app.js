let createError = require('http-errors');
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let session = require('express-session');
let multer = require('multer');
let upload = multer({ dest: 'uploads/' });
let moment = require('moment');
let expressValidator = require('express-validator');

let mongo = require('mongodb');
let db = require('monk')('localhost/nodeblog');

// let routes = require('./routes/index');
// let users = require('./routes/users')


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      let namespace = param.split('.')
          , root = namespace.shift()
          , formParam = root;
      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
          msg: msg,
          value: value
      };
    }
}));
//Connect-Flash
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
  console.log(req);
  next();
});
app.get('/', function(req, res, next) {
    let db = req.db;
    // console.log(db);
    let posts = db.get('posts');
    posts.find({}, {}, (posts, err) => {
        res.render('index', { posts: posts });
    });

});

module.exports = app;
