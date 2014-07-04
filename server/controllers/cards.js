'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Board = mongoose.model('Board'),
  passport = require('passport');

exports.create = function(req, res, next) {
  var card = req.body.card;
  card.user = {
    name: req.user.name,
    email: req.user.email,
    facebook: req.user.facebook.id
  };

  Board.findById(req.params.id, function(err, board) {
    if (err) return res.json(400, err);
    board.cards.push(card);
    board.save(function(err, board) {
      if (err) return res.json(400, err);
      res.send(board.cards[board.cards.length - 1]);
    });
  });
};

exports.update = function(req, res, next) {
  var card = req.body.card;
  if (!card.user)
    card.user = {
      name: req.user.name,
      email: req.user.email,
      facebook: req.user.facebook.id
    };

  Board.findById(req.params.id, function(err, board) {
    if (err) return res.json(400, err);
    var newCard = board.cards.id(card._id);
    newCard.meta = card.meta;
    newCard.style = card.style;
    newCard.user = card.user;
    board.save(function(err) {
      if (err) return res.json(400, err);
      res.send(card);
    });
  });
};

exports.delete = function(req, res, next) {
  Board.findById(req.params.id, function(err, board) {
    if (err) return res.json(400, err);
    board.cards.id(req.body.card._id).remove();
    board.save(function(err, board) {
      if (err) return res.json(400, err);
      res.send(req.body.card);
    });
  });
};
