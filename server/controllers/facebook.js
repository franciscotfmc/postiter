'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  fb = require('../lib/facebook');

exports.friends = function(req, res, next) {
  fb.getFbData(req.user.facebook.token, '/me/friends', function(data) {
    res.send(data);
  });
};
