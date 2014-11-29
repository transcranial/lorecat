'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Quiz Schema
 */
var QuizSchema = new Schema({
  userId: Schema.Types.ObjectId,
  title: String,
  lastSaved: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
