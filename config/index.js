'use strict';

/**
 * Load app configurations
 */

const configSource = process.env.NODE_ENV || 'development';
module.exports = require('./env/' + configSource);
