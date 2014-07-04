'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User');

User.find({}).remove(function() {
  User.create({
      facebook: {
        name: 'Francisco',
        email: 'f.thiene@gmail.com',
        id: 'id',
        token: 'token'
      }
    }, {
      local: {
        email: 'f.thiene@gmail.com',
        password: ''
      }
    },
    function() {});
});
