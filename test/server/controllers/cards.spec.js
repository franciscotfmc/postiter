'use strict';

describe('Cards Controller', function() {

  // var helper = require('../helper.js');
  require('../../../server/models/board.js');

  var request = require('request'),
    mongoose = require('mongoose'),
    Board = mongoose.model('Board');

  var board;

  var card = {
    meta: {
      index: 0,
      text: 'First card',
      thumb: true,
    },
    style: {
      edit: false,
      hover: false,
      expand: false,
      transparent: false,
      color: 'green'
    }
  };

  var requestCreate = {
    form: {
      card: card
    }
  };

  var persistedCard;

  beforeEach(function(done) {
    board = new Board();
    board.title = 'First Board';
    board.owner = {
      facebook: {
        name: 'Francisco',
        email: 'f.thiene@gmail.com'
      }
    };

    board.cards.push(card);
    board.users.push(board.owner);
    board.save(function(err) {
      done();
    });

    persistedCard = {
      form: {
        card: {
          _id: board.cards[0]._id + '',
          meta: card.meta,
          style: card.style
        }
      }
    };
  });

  it('should create a card', function(done) {
    request.post('http://localhost:9001/api/board/' + board._id + '/cards', requestCreate, function(error, response, body) {
      expect(JSON.parse(body)._id).not.toBeUndefined();
      done();
    });
  });

  it('should update a card', function(done) {
    persistedCard.form.card.meta.text = 'Card updated';
    request.put('http://localhost:9001/api/board/' + board._id + '/cards', persistedCard, function(error, response, body) {
      expect(JSON.parse(body).meta.text).toBe('Card updated');
      done();
    });
  });

  it('should delete a card', function(done) {
    Board.findById(board._id, function(err, doc) {
      expect(doc.cards.length).toBe(1);
      done();
    });

    request.post('http://localhost:9001/api/board/' + board._id + '/card/remove', persistedCard, function(error, response, body) {
      Board.findById(board._id, function(err, doc) {
        expect(doc.cards.length).toBe(0);
        done();
      });
    });
  });

});
