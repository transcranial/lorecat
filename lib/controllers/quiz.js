'use strict';

var mongoose = require('mongoose'),
    Quiz = mongoose.model('Quiz');

/**
 * Saves quiz
 */
exports.save = function (req, res) {
  var newUser = new Quiz(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 * Get current user
 */
exports.load = function(req, res) {
  res.json(req.user);
};