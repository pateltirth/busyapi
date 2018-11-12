var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// simple in-memory usage store
// Important observations: 
// 1. You can not persist data on server fails
// 2. in-memory store have upper limit on memory 

//So add mangoose schema 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schemas can go to saperate files 
var Counter = new Schema({
  _id: {type: String, required: true},
  seq: { type: Number, default: 0 }
}, {
	collection: 'Counter'
});

var Usages = new Schema({
  usageId: {type: Number, required: true},
  patientId: {type: Number, required: true},
  medication: {type: String, required: true},
	timestamp: {type: String, required: true}
}, {
	collection: 'Usages'
});

//connect to your database
var usageModel = mongoose.model('usageModel', Usages);
var counterModel = mongoose.model('counterModel', Counter);
mongoose.connect('mongodb://localhost:27017/propeller');

var usages = [];
app.usages = usages;

//can be modified 
app.usageModel = usageModel;
app.counterModel = counterModel;

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

app.use('/', index);
app.use('/users', users);

// API
require('./routes/api/usages')(app);

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
