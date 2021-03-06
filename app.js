var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connect = require('./models/connectdb')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dbRouter = require('./routes/db');
var checkoutRouter = require('./routes/checkout');

var session = require("express-session");
var app = express();
app.use(
  session({ 
   secret: 'a4f8071f-c873-4447-8ee2',
   resave: false,
  saveUninitialized: false,
  })
);

app.locals.formatDate  = (currentDate) => {
  let dateConvert = new Date(currentDate);
  let dayDate = dateConvert.getDate();
  let monthDate = dateConvert.getMonth()+1;
  let yearDate = dateConvert.getFullYear();

  let prefixDay = dayDate <10 ? "0" + dayDate : dayDate;
  let prefixMonth = monthDate <10 ? "0" + monthDate : monthDate;
  let finalDate = prefixDay + "/" + prefixMonth + "/" + yearDate;
  return finalDate
}

// view engine setup


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/db', dbRouter);
app.use('/checkout', checkoutRouter);

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

module.exports = app;
