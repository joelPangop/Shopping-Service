const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt=require('jsonwebtoken');
const exphds = require('express-handlebars');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const connection = require('./controllers/WizardController');
const cors = require("cors");

// view engine setup
app.engine('handlebars', exphds());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({
  origin: ['http://localhost:8100', 'http://localhost:8101', 'http://localhost:8200', 'http://localhost:4200', 'http://localhost:4400',
    'http://192.168.2.58:8100', 'http://192.168.2.58:8101', 'http://10.103.4.78:8100']
}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", 'Authorization, Content-Length');
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
  next();
});

const mongoose = require("mongoose");

app.use('/', indexRouter);
app.use('/users', usersRouter);

require("./models/User");
const User = mongoose.model("User");

connection.createIfNotExistAdminUser;

app.use(function(req,res,next){
  try{
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, key.tokenKey, function (err, payload) {
      console.log(payload);
      if (payload) {
        user.findById(payload.userId).then(
            (doc)=>{
              req.user=doc;
              next()
            }
        )
      } else {
        next()
      }
    })
  }catch(e){
    next()
  }
});

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
