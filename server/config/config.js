'use strict';

var _ = require('lodash');

/**
 * Load environment configuration
 */
module.exports = _.extend(
  require('./envs/all.js'),
  require('./envs/' + process.env.NODE_ENV + '.js') || {});
