'use strict';

var io = require('socket.io');

module.exports = function(app) {
  app.io.route('new-card', function(req) {
    req.io.room(req.data.room).broadcast('new-card', {
      card: req.data.card
    });
  });

  app.io.route('update-card', function(req) {
    req.io.room(req.data.room).broadcast('update-card', {
      card: req.data.card
    });
  });

  app.io.route('delete-card', function(req) {
    req.io.room(req.data.room).broadcast('delete-card', {
      card: req.data.card
    });
  });

  app.io.route('connect-board', function(req) {
    req.io.join(req.data._id);
  });

  app.io.route('disconnect-board', function(req) {
    req.io.leave(req.data._id);
  });

  app.io.route('new-member', function(req) {
    req.io.room(req.data.room).broadcast('new-member', {
      member: req.data.member
    });
  });

  app.io.route('delete-member', function(req) {
    req.io.room(req.data.room).broadcast('delete-member', {
      member: req.data.member
    });
  });

  app.io.route('blur-cards', function(req) {
    req.io.room(req.data.room).broadcast('blur-cards');
  });
};
