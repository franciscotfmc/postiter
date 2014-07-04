'use strict';

var users = require('./controllers/users'),
  cards = require('./controllers/cards'),
  boards = require('./controllers/boards'),
  members = require('./controllers/members'),
  notifications = require('./controllers/notifications'),
  facebook = require('./controllers/facebook'),
  feedback = require('./controllers/feedback'),
  io = require('socket.io');

var middleware = require('./middleware');

module.exports = function(app, passport) {

  // Boards
  app.post('/api/boards', boards.create);
  app.get('/api/boards', boards.get);
  app.get('/api/board/:id', boards.show);
  app.delete('/api/board/:id', boards.delete);
  app.post('/api/board/:id/blur', boards.blur);

  // Cards
  app.post('/api/board/:id/cards', cards.create);
  app.put('/api/board/:id/cards', cards.update);
  app.post('/api/board/:id/card/remove', cards.delete);

  // Members
  app.post('/api/board/:id/members', members.create);
  app.post('/api/board/:id/members/remove', members.delete);

  // Users
  app.get('/api/fb/friends', facebook.friends);
  app.get('/api/users/me', users.me);

  // Create notifications routes
  notifications(app);

  // Feedback
  app.post('/api/feedback', feedback.create);

  // Undefined api routes should return a 404
  app.get('/api/*', function(req, res) {
    res.send(404);
  });

  // Show index or send single page app
  app.get('/', middleware.setUserCookie, function(req, res) {
    if (req.isAuthenticated()) {
      res.render('application.html');
    } else {
      res.render(__dirname + '/views/index.ejs');
    }
  });

  // Facebook login
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: 'email'
  }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/'
    })
  );

  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};
