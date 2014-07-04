'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt-nodejs');

var authTypes = ['github', 'twitter', 'facebook', 'google'];

var UserSchema = new Schema({

  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  twitter: {
    id: String,
    token: String,
    displayName: String,
    username: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }

});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

UserSchema
  .virtual('name')
  .get(function() {
    return this.facebook.name;
  });

UserSchema
  .virtual('email')
  .get(function() {
    return this.facebook.email;
  });

UserSchema
  .virtual('info')
  .get(function() {
    return {
      name: this.facebook.name,
      email: this.facebook.email,
      facebook: this.facebook.id
    };
  });

mongoose.model('User', UserSchema);
