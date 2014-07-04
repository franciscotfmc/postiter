'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
  text: String,
  user: {
    name: String,
    email: String
  }
});

mongoose.model('Feedback', FeedbackSchema);
