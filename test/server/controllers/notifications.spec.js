'use strict';

describe('Notifications Controller', function() {

  var io = require('socket.io-client');
  var client = io.connect('http://localhost:7076');
  var other = io.connect('http://localhost:7076');
  client.emit('connect-board');

  it('should connect to board', function(done) {
    done();
  });

});
