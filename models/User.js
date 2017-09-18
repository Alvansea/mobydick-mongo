'use strict';

const Schema = require('mongoose').Schema;
const ObjectId = Schema.Types.ObjectId;
const message = require('../app/message');
const crypto = require('crypto');
const validator = require('../lib/validator');
const models = require('./').models;

const User = 
exports.schema = new Schema({
  username:     { type: String },
  password:     { type: String },
  salt:         { type: String },
  nickname:     { type: String },
  email:        { type: String },
  portrait:     { type: String },
  deleted:      { type: Boolean, default: false },
  lastLogin:    { type: Date },

  isAdmin:      { type: Boolean, default: false },
}, {
  timestamps: true
});

const _genSalt = function() {
  return Math.random().toString(36).slice(2, 9);
}

const _calcHash = function(pass, salt) {
  if (!pass) {
    return '';
  }
  let sha = crypto.createHash('sha256');
  sha.update(pass + '');
  sha.update(salt + '');
  return sha.digest('base64');
}

const _nonce = function() {
  return Math.random().toString(36).slice(2, 9);
}

User.statics.doRegister = function(options, cb) {

  let username = validator.removeBad(options.username);

  if (!options.username
    || !options.newpass
    || options.newpass.length < 6) {
    return cb(message.BadRequest);
  }

  this
  .findOne({ 
  	username: options.username 
  })
  .exec((err, user) => {

    if (err) {
      return cb(err);
    }

    if (user) {
      return cb(message.UsernameConflicted);
    }

    options.salt = _genSalt();
    options.password = _calcHash(options.newpass, options.salt);

    this.create(options, (err, user) => {
      if(err) {
        return cb(err);
      }
      delete user.password;
      delete user.newpass;
      delete user.salt;

      return cb(null, user);
    });
  });
}