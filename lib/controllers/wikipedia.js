'use strict';

var events = require('events'),
  eventEmitter = new events.EventEmitter(),
  request = require('request'),
  natural = require('natural'),
  TfIdf = natural.TfIdf,
  tfidf = new TfIdf(),
  docCounter = 0,
  docTitles = [];

function shuffle(o) {
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function checkAllFetched(limit) {
  if (docCounter === limit + 1) {
    eventEmitter.emit('allFetched');
  }
}

function getArticle(title, limit) {
  var url = 'http://en.wikipedia.org/w/api.php?redirects=true&format=json&utf8=true&action=query&titles=' + title + '&prop=extracts&explaintext=true&exsectionformat=plain';

  request({
    url: url,
    json: true
  }, function (error, response, body) {
    var content;
    if (!error && response.statusCode === 200) {
      if (body.query.pages[Object.keys(body.query.pages)[0]].hasOwnProperty('extract')) {
        content = body.query.pages[Object.keys(body.query.pages)[0]].extract;
      }
      if (content) {
        content = content.replace(/\[citation needed\]/g, '');
        content = content.replace(/\[\d+\]/g, '');
        tfidf.addDocument(content);
        docTitles.push(title);
        docCounter++;
        checkAllFetched(limit);
      }
    }
  });
}

function getLinks(title, limit) {
  var url = 'http://en.wikipedia.org/w/api.php?redirects=true&format=json&utf8=true&action=query&titles=' + title + '&prop=links&plnamespace=0&pllimit=500';

  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      if (!body.query.pages[Object.keys(body.query.pages)[0]].hasOwnProperty('links')) {
        return;
      }
      var linksArray = body.query.pages[Object.keys(body.query.pages)[0]].links;
      var linkTitle = '';
      linksArray = shuffle(linksArray);
      for (var i = 0; i < Math.min(linksArray.length, limit); i++) {
        linkTitle = linksArray[i].title;
        linkTitle = linkTitle.replace(/ /g, '_');
        //console.log(linkTitle);
        getArticle(linkTitle, Math.min(linksArray.length, limit));
      }
    }
  });
}

function fetchDocuments(articleTitle, maxLimit) {
  getArticle(articleTitle, maxLimit);
  getLinks(articleTitle, maxLimit);
}


/**
 * Get main page terms
 */
exports.getMainTerms = function (articleTitle, articleLimit, termLimit, tfidfLimit, callback) {
  var termsList = [];
  fetchDocuments(articleTitle, articleLimit);
  eventEmitter.on('allFetched', function() {
    // gets terms of main article
    var allTerms = tfidf.listTerms(docTitles.indexOf(articleTitle));
    var aboveTfidfThreshold, notPartOfArticleTitle;
    for (var i = 0; i < Math.min(allTerms.length, termLimit); i++) {
      aboveTfidfThreshold = allTerms[i].tfidf >= tfidfLimit;
      notPartOfArticleTitle = articleTitle.toLowerCase().indexOf(allTerms[i].term) === -1;
      if (aboveTfidfThreshold && notPartOfArticleTitle) {
        console.log(allTerms[i].term + ': ' + allTerms[i].tfidf);
        termsList.push(allTerms[i].term);
      }
    }
    docCounter = 0;
    // return callback function with no errors
    return callback(null, termsList);
  });
};


/**
 * Get main page content
 */
exports.getMainSections = function(articleTitle, callback) {

  function extractWikiJSON(wikijson) {

    var obj = wikijson.query.pages[Object.keys(wikijson.query.pages)[0]];
    if (!obj.hasOwnProperty('extract') || !obj.hasOwnProperty('title')) {
      return;
    }

    var sections = [],
      wikiextract = wikijson.query.pages[Object.keys(wikijson.query.pages)[0]].extract,
      sectionTitlesNotIncluded = ['See also', 'References', 'Further reading', 'External links', 'Works cited', 'Cited texts'],
      cursorStart = 0,
      cursorEnd = wikiextract.indexOf('\n== ');
      
    if (cursorEnd === -1) {
      cursorEnd = wikiextract.length;
    }

    var level = 0,
      title = wikijson.query.pages[Object.keys(wikijson.query.pages)[0]].title,
      abstract = {sectionLevel: level, sectionTitle: title, sectionText: wikiextract.substring(cursorStart, cursorEnd)};
    sections.push(abstract);

    var headingRE = /\n==+ (.*?) (==+)\n?/g,
      headingRE_results = headingRE.exec(wikiextract),
      text = '',
      section = {};
      
    while (cursorEnd !== wikiextract.length) {
      title = headingRE_results[1];
      level = headingRE_results[2].length - 1;
      cursorStart = headingRE.lastIndex;
      headingRE_results = headingRE.exec(wikiextract);
      if (headingRE_results === null) {
        cursorEnd = wikiextract.length;
      } else {
        cursorEnd = headingRE_results.index;
      }
      text = wikiextract.substring(cursorStart, cursorEnd).trim() + '\n';
      text = text.replace(/\[citation needed\]/g, '');
      text = text.replace(/\n+/g, '<br><br>');
      section = {sectionLevel: level, sectionTitle: title, sectionText: text};
      if (sectionTitlesNotIncluded.indexOf(title) === -1) {
        sections.push(section);
      }
    }

    return sections;
  }

  var url = 'http://en.wikipedia.org/w/api.php?redirects=true&format=json&utf8=true&action=query&titles=' + articleTitle + '&prop=extracts&explaintext=true&exsectionformat=wiki';

  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      try {
        var sections =  extractWikiJSON(body);
        return callback(null, sections);
      } catch (e) {
        return callback(e.message, null);
      }
    }
    else {
      return callback('error', null);
    }
  });

};


/**
 * Get main page thumbnail image
 */
exports.getMainThumbnail = function(articleTitle, thumbnailWidth, callback) {
  var url = 'http://en.wikipedia.org/w/api.php?redirects=true&format=json&action=query&titles=' + articleTitle + '&prop=pageimages&pithumbsize=' + thumbnailWidth;

  request({
    url: url,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      try {
        if (body.query.pages[Object.keys(body.query.pages)[0]].hasOwnProperty('thumbnail')) {
          var thumbnailURL = body.query.pages[Object.keys(body.query.pages)[0]].thumbnail.source;
          return callback(null, thumbnailURL);
        }
      } catch (e) {
        return callback(e.message, null);
      }
    }
    else {
      return callback('error', null);
    }
  });
};