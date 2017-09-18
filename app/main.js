'use strict';

const path = require('path');
const express = require('express');
const app = express();
const ECT = require('ect');
const helmet = require('helmet');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const flash = require('connect-flash');
const bodyParser = require('body-parser');

const env = process.env.NODE_ENV || 'development';
const config = require('../conf').app;
const mdc = require('mobydick-core');
const fileLogger = require('./logger');
const message = require('./message');

let rootDir = path.join(__dirname, '..');
let views = path.join(rootDir, 'views');
let staticDirs = [
  'public',
  'bower_components',
  'assets'
];

let routeDirs = [
  'routes/shared',
  'routes/admin',
  'routes/web',
];

app.set('name', config.name);
app.set('port', config.port);

app.set('views', views);
app.set('view engine', 'html');

app.engine('html', ECT({ 
  watch: true, 
  root: views
}).render);

app.use(helmet());
app.use(morgan(env == 'development' ? 'dev' : 'common', {
  skip: function(req, res) {
    return req.url.indexOf('.js') > 0 
      || req.url.indexOf('.css') > 0
      || req.url.indexOf('.woff') > 0;
    // return req.method == 'GET' && res.statusCode < 400;
  }
}));

staticDirs.forEach(dir => {
  app.use(express.static(path.join(rootDir, dir)));
});
if(config.favicon) {
  app.use(favicon(path.join(rootDir, config.favicon)));
}

app.use(session({
  secret: config.session_secret,
  resave: false,
  saveUninitialized: true,
  store: new RedisStore(config.redis)
}));

app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// pre routes
app.use(function(req, res, next) {

  res.locals.currentUser = req.session.user;    
  res.locals.env = env;
  res.locals.paginator = {};

  return next();
})

// routes
let router = express.Router();
routeDirs.forEach(dir => {
  mdc.routeHelper.inject(router, path.join(rootDir, dir));
})
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(message.NotFound);
});

// error logger
let errLogger = fileLogger.get('error');
let accessLogger = fileLogger.get('access');
app.use(function(err, req, res, next) {
  if(err.status == 404) {
    let msg404 = req._remoteAddress + ' 404 GET ' + req.originalUrl;
    console.log(msg404);
    accessLogger && accessLogger.info(msg404);
  } else {
    errLogger && errLogger.error(err.stack);
  }
  next(err);
})

// error handling
app.use(function(err, req, res, next) {

  // res.status(err.status || 500);
  let status = err.status < 1000 ? err.status : 200;
  res.status(status);

  err.status = err.status || 500;
  let customErr = (env != 'production') ? err : {
    status: err.status,
    errMsg: 'Server Error'
  }
  if(customErr instanceof Error && !customErr.errMsg) {
    customErr.errMsg = customErr.message;
  }

  if(env == 'development') {
    console.log('Error Handler:', customErr);
  }

  if(req.xhr) {
    res.send(customErr);
  } else {
    res.render('web/error', {
      error: customErr
    });
  }
})

if(!module.parent) {
  app.listen(app.get('port'));
  console.log(app.get('name') + ' started on port ' + app.get('port'));
}