'use strict';

var express = require('express.io'),
  path = require('path'),
  fs = require('fs'),
  mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Application Config
var config = require('./config/config');

// Connect to database
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'models');
fs.readdirSync(modelsPath).forEach(function(file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./config/dummydata');

// Passport Configuration
var passport = require('./config/passport');

var app = express().http().io();

// Express settings
require('./config/express')(app);

// Routing
require('./routes')(app, passport);

// Start server
var server = app.listen(config.port, function() {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

// var io = require('socket.io').listen(server);

// Expose app
exports = module.exports = app;
