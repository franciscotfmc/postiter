'use strict';

describe('Members Controller', function() {

  require('../../../server/models/board.js');

  var request = require('request'),
    mongoose = require('mongoose'),
    Board = mongoose.model('Board');

  var board;

  var member = {
    id: '2',
    name: 'Sr. Barriga',
    email: 'barriguinha@gmail.com'
  };

  var requestCreate = {
    form: {
      member: member
    }
  };

  var persistedMember;

  beforeEach(function(done) {
    board = new Board();
    board.title = 'First Board';
    board.owner = {
      facebook: {
        id: '1',
        email: 'f.thiene@gmail.com',
        name: 'Francisco'
      }
    };

    board.users.push(board.owner);
    board.users.push({
      facebook: {
        id: '3',
        email: 'willberemoved@gmail.com',
        name: 'willberemoved'
      }
    });
    board.save(function(err) {
      done();
    });
  });

  it('should add member to board', function(done) {
    Board.findById(board._id, function(err, doc) {
      expect(doc.users.length).toBe(2);
      done();
    });
    request.post('http://localhost:9001/api/board/' + board._id + '/members', requestCreate, function(error, response, body) {
      Board.findById(board._id, function(err, doc) {
        expect(doc.users.length).toBe(3);
        done();
      });
      done();
    });
  });

  it('should remove member from board', function(done) {
    Board.findById(board._id, function(err, doc) {
      expect(doc.users.length).toBe(2);
      done();
    });

    request.post('http://localhost:9001/api/board/' + board._id + '/members/remove', {
      form: {
        member: board.users[1]
      }
    }, function(error, response, body) {
      Board.findById(board._id, function(err, doc) {
        expect(doc.users.length).toBe(1);
        done();
      });
    });
  });

});
