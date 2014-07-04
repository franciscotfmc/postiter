'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Board = mongoose.model('Board'),
  passport = require('passport');

exports.create = function(req, res, next) {
  var member = {
    facebook: req.body.member
  };

  Board.findById(req.params.id, function(err, board) {
    if (err) return res.json(400, err);
    board.users.push(member);
    board.save(function(err, member) {
      if (err) return res.json(400, err);
      res.send(board.users[board.users.length - 1]);
    });
  });
};

exports.delete = function(req, res, next) {
  Board.findById(req.params.id, function(err, board) {
    if (err) return res.json(400, err);

    var member = req.body.member;
    member = board.users.filter(function(user) {
      return member.facebook.id === user.facebook.id;
    })[0];
    var index = board.users.indexOf(member);

    if (member.facebook.id === board.owner.facebook.id)
      return res.json(400, {
        "message": "Invalid operation"
      });

    board.users.splice(index, 1);
    board.save(function(err, member) {
      if (err) return res.json(400, err);
      res.send(member);
    });
  });
};
