'use strict';

var express = require('express'),
  path = require('path'),
  config = require('./config'),
  passport = require('passport'),
  flash = require('connect-flash'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  mongoStore = require('connect-mongo')(express);

/**
 * Express configuration
 */
module.exports = function(app) {
  app.configure('development', function() {
    app.use(require('connect-livereload')());

    // Disable caching of scripts for easier testing
    app.use(function noCache(req, res, next) {
      if (req.url.indexOf('/scripts/') === 0) {
        res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.header('Pragma', 'no-cache');
        res.header('Expires', 0);
      }
      next();
    });

    app.use(express.bodyParser());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client/app')));
    app.use(express.errorHandler());
    app.set('views', config.root + '/client/app');
  });

  app.configure('production', function() {
    app.use(express.favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('views', config.root + '/public');
  });

  app.configure('test', function() {
    passport.initialize = function(req, res, next) {
      return function(req, res, next) {
        var user = {
          facebook: {
            id: '1',
            name: 'Francisco',
            email: 'f.thiene@gmail.com',
            token: 'token'
          }
        };

        passport = this;
        passport._key = 'passport';
        passport._userProperty = 'user';
        passport.serializeUser = function(user, done) {
          return done(null, user.id);
        };
        passport.deserializeUser = function(user, req, done) {
          return done(null, user);
        };

        req._passport = {
          instance: passport
        };
        req._passport.session = {
          user: new User(user)
        };
        return next();
      };
    };
  });

  app.configure(function() {
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser());

    // Persist sessions with mongoStore
    app.use(express.session({
      secret: 'angular-fullstack secret',
      store: new mongoStore({
        url: config.mongo.uri,
        collection: 'sessions'
      }, function() {
        console.log('db connection open');
      })
    }));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //use flash messages
    app.use(flash());

    // Router needs to be last
    app.use(app.router);
  });
};
