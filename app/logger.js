'use strict';

const path = require('path');
const mdc = require('mobydick-core');

module.exports = new mdc.FileLogger({
  root: path.join(__dirname, '../logs')
})