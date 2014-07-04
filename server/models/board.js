'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var CardSchema = new Schema({
  meta: {
    text: String,
    index: Number,
    thumb: Boolean,
  },
  style: {
    edit: Boolean,
    hover: Boolean,
    expand: Boolean,
    color: String
  },
  user: {
    email: String,
    name: String,
    facebook: String
  }
});

var BoardSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    required: true
  },
  users: [],
  owner: {},
  cards: [CardSchema]
});

BoardSchema.path('users').validate(function(users) {
  var user = users.pop();

  for (var i = 0; i < users.length; i++)
    if (users[i].facebook.id === user.facebook.id)
      return false;

  users.push(user);
  return true;
}, 'This user is already a board member');

BoardSchema.path('visibility').validate(function(visibility) {
  return visibility == 'visible' || visibility == "blurry";
}, 'Invalid value for visibility');

mongoose.model('Board', BoardSchema);
