'use strict';

const configSource = process.env.NODE_ENV || 'development';
module.exports = require('./env/' + configSource);
