'use strict';

describe('Boards Controller', function() {

  var helper = require('../helper.js');
  require('../../../server/models/board.js');

  var request = require('request'),
    mongoose = require('mongoose'),
    Board = mongoose.model('Board');

  var board = {
    title: 'First board'
  };

  var requestCreate = {
    form: board
  };

  beforeEach(function(done) {
    helper.clearCollections(done);
  });

  it('should create a board', function(done) {
    request.post('http://localhost:9001/api/boards', requestCreate, function(error, response, body) {
      Board.count(function(err, count) {
        expect(count).toBe(1);
        expect(JSON.parse(body).status).toBe(2);
        done();
      });
    });
  });

  it('should not create a board', function(done) {
    requestCreate.form.title = '';
    request.post('http://localhost:9001/api/boards', requestCreate, function(error, response, body) {
      Board.count(function(err, count) {
        expect(count).toBe(0);
        expect(JSON.parse(body).status).toBe(1);
        done();
      });
    });
  });

  it('should get boards', function(done) {
    var board = new Board();
    board.title = 'Title';
    board.owner = {
      facebook: {
        name: 'Francisco',
        email: 'f.thiene@gmail.com'
      }
    };

    board.save(function(err) {
      done();
    });

    request.get('http://localhost:9001/api/boards', function(error, response, body) {
      expect(JSON.parse(body).output.length).toBe(1);
      done();
    });
  });

  it('should show board', function(done) {
    var board = new Board();
    board.title = 'Title';
    board.owner = {
      name: 'Francisco',
      email: 'f.thiene@gmail.com'
    };

    board.save(function(err) {
      done();
    });

    request.get('http://localhost:9001/api/board/' + board._id, function(error, response, body) {
      expect(JSON.parse(body).status).toBe(2);
      expect(JSON.parse(body).output._id).toBe(board._id + '');
      done();
    });
  });
});
