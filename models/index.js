'use strict';

const fs = require('fs');
const path = require('path');
const conf = require('../conf').mongodb;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let authStr = conf.username && conf.password ? `${conf.username}:${conf.password}@` : '';
let mongodbcnnstr = `mongodb://${authStr}${conf.host}:${conf.port}/${conf.database}`;

console.log('connect to', mongodbcnnstr);

mongoose.Promise = global.Promise;

let db = 
module.exports = mongoose.createConnection(mongodbcnnstr, (err) => {
  if(err) {
    console.log(err);
  }
});

let _extendSchema = function(schema) {
  schema.methods.checkPath = function(pathnames, cb) {
    if(!(pathnames instanceof Array)) {
      pathnames = [pathnames];
    }
    let unpopulated = [];
    pathnames.forEach(pathname => {
      if(!this.populated(pathname)) {
        unpopulated.push(pathname);
      }
    })
    if(!unpopulated.length) {
      return cb();
    }
    this.populate(unpopulated, cb);
  }
}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return file != 'index.js' && file[0] != '_' && file[0] != '.'
  })
  .forEach(function (file) {
    var modelName = path.basename(file, '.js');
    var modelSchema = require(path.join(__dirname, file)).schema;
    if(modelSchema) {
      _extendSchema(modelSchema);
      db.model(modelName, modelSchema);
    }
  });
