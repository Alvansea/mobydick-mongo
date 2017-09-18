'use strict';

const env = process.env.NODE_ENV || 'development';

module.exports = require('./env/' + env);

if(env != 'production') {
  console.debug = console.log;
} else {
  console.debug = function() {}
}