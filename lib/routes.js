'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app, passport) {

  // Server API Routes
  app.route('/api/quiz/wikipedia/:articleTitle')
    .get(api.getQuizContent);
  app.route('/api/quiz/wikipedia/thumbnail/:articleTitle')
    .get(api.getQuizThumbnail);
  app.route('/api/autocomplete/wikipedia/:pageSearch')
    .get(api.pageSearchAutocomplete);
  
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });



  // Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
      scope: ['email', 'user_about_me'],
      failureRedirect: '/login'
  }), function (req, res) {
    res.redirect('/login');
  });

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/login'
  }), function (req, res) {
    res.redirect('/');
  });

  // Setting the twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter', {
      failureRedirect: '/login'
  }), function (req, res) {
    res.redirect('/login');
  });

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      failureRedirect: '/login'
  }), function (req, res) {
    res.redirect('/');
  });

  // Setting the google oauth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });



  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};