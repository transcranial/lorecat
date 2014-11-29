'use strict';

var mongoose = require('mongoose'),
  request = require('request'),
  child_process = require('child_process');

// memcached env variables automatically recognized by memcached, defaults to localhost:11211
var memjs = require('memjs'),
  memcached = memjs.Client.create();


exports.getQuizContent = function(req, res) {

  var message = {
    'fetchObj': 'quizContent',
    'params': {
      'articleTitle': req.params.articleTitle,
      'articleLimit': req.query.articleLimit,
      'termLimit': req.query.termLimit,
      'tfidfLimit': req.query.tfidfLimit
    }
  };

  var memkey = JSON.stringify(message);
  return memcached.get(memkey, function (err, quizContentJsonCached) {
    if (quizContentJsonCached) {
      return res.send(200, JSON.parse(quizContentJsonCached.toString()));
    } else {
      var child = child_process.fork('lib/controllers/wikipedia_worker');
      child.send(message);
      child.on('message', function(quizContentJSON) {
        memcached.set(memkey, new Buffer(JSON.stringify(quizContentJSON)), function (errorMemcachedSet) {
          if (errorMemcachedSet) console.error(errorMemcachedSet);
        }, 86400);
        return res.json(quizContentJSON);
      });
    }
  });

};


exports.getQuizThumbnail = function(req, res) {

  var message = {
    'fetchObj': 'quizThumbnail',
    'params': {
      'articleTitle': req.params.articleTitle,
      'thumbnailWidth': req.query.thumbnailWidth
    }
  };

  var memkey = JSON.stringify(message);
  return memcached.get(memkey, function (err, thumbnailUrlCached) {
    if (thumbnailUrlCached) {
      return res.send(200, thumbnailUrlCached.toString());
    } else {
      var child = child_process.fork('lib/controllers/wikipedia_worker');
      child.send(message);
      child.on('message', function(thumbnailURL) {
        memcached.set(memkey, thumbnailURL, function (errorMemcachedSet) {
          if (errorMemcachedSet) console.error(errorMemcachedSet);
        }, 86400);
        return res.send(200, thumbnailURL);
      });
    }
  });

};


exports.pageSearchAutocomplete = function(req, res) {
  var memkey = 'autocomplete-' + req.params.pageSearch;
  return memcached.get(memkey, function (err, autocompleteResultsCached) {
    if (autocompleteResultsCached) {
      return res.send(200, JSON.parse(autocompleteResultsCached.toString()));
    } else {

      var url = 'http://en.wikipedia.org/w/api.php?format=json&action=query&list=search&srwhat=text&srprop=&srsearch=' + req.params.pageSearch;

      request({
        url: url,
        json: true
      }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var titles = [];
          body.query.search.forEach(function (item) {
            titles.push({'title': item.title});
          });
          var autocompleteResults = {
            titles: titles
          };
          memcached.set(memkey, new Buffer(JSON.stringify(autocompleteResults)), function (errorMemcachedSet) {
            if (errorMemcachedSet) console.error(errorMemcachedSet);
          }, 86400);
          return res.json(autocompleteResults);
        }
      });

    }
  });  
};