'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Board = mongoose.model('Board'),
  passport = require('passport');

var checkCanSeeBoard = function(users, req) {
  for (var i = 0; i < users.length; i++)
    if (users[i].facebook.id === req.user.facebook.id)
      return true;

  return false;
};

exports.create = function(req, res, next) {
  var board = new Board(req.body);
  board.owner = req.user;
  board.visibility = 'blurry';

  board.users.push(board.owner);

  board.save(function(err) {
    if (err) {
      res.json({
        status: 1,
        output: {}
      });
    } else {
      res.json({
        status: 2,
        output: board
      });
    }
  });
};

exports.delete = function(req, res, next) {
  Board.findById(req.params.id, function(err, board) {
    board.remove();
    if (err || !checkCanSeeBoard(board.users, req)) {
      res.json({
        status: 1,
        output: {}
      });
    } else {
      res.json({
        status: 2,
        output: board
      });
    }
  });
};

exports.get = function(req, res, next) {
  Board.find({
    'users.facebook.id': req.user.facebook.id
  }).sort({
    '_id': 'desc'
  }).execFind(function(err, boards) {
    if (err) {
      res.json({
        status: 1,
        output: {}
      });
    } else {
      res.json({
        status: 2,
        output: boards
      });
    }
  });

};

exports.show = function(req, res, next) {
  Board.findById(req.params.id, function(err, board) {
    if (err || !checkCanSeeBoard(board.users, req)) {
      res.json({
        status: 1,
        output: {}
      });
    } else {
      res.json({
        status: 2,
        output: board
      });
    }
  });
};

exports.blur = function(req, res, next) {
  Board.findById(req.params.id, function(err, board) {
    if (err) return res.json(400, err);

    if (board.visibility === 'blurry')
      board.visibility = 'visible';
    else
      board.visibility = 'blurry';

    board.save(function(err) {
      if (err) {
        res.json({
          status: 1,
          output: {}
        });
      } else {
        res.json({
          status: 2,
          output: board
        });
      }
    });
  });
};
