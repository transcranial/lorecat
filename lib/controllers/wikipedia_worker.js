var wikipedia = require('./wikipedia');

process.on('message', function (message) {

  if (message.fetchObj === 'quizContent') {

    var articleTitle = message.params.articleTitle,
      articleLimit = parseInt(message.params.articleLimit),
      termLimit = parseInt(message.params.termLimit),
      tfidfLimit = parseFloat(message.params.tfidfLimit);
   
    wikipedia.getMainSections(articleTitle, function (errSections, sections) {

      if (!errSections) {
        wikipedia.getMainTerms(articleTitle, articleLimit, termLimit, tfidfLimit, function (errTerms, terms) {
          if (!errTerms) {
            var quizContentJSON = { 'articleTitle': articleTitle, 'terms': terms, 'sections': sections };
            try {
              process.send(quizContentJSON);
              process.disconnect();
            } catch (err) {
              console.error("wikipedia_worker.js: [error sending results] " + err.message);
              process.disconnect();
            }
          } else {
            console.error("wikipedia_worker.js: [error calling wikipedia.getMainTerms()] " + errTerms);
            process.disconnect();
          }
        });
      } else {
        console.error("wikipedia_worker.js: [error calling wikipedia.getMainSections()] " + errSections);
        process.disconnect();
      }

    });

  } else if (message.fetchObj === 'quizThumbnail') {

    var articleTitle = message.params.articleTitle,
      thumbnailWidth = message.params.thumbnailWidth;

    wikipedia.getMainThumbnail(articleTitle, thumbnailWidth, function (error, url) {

      if (!error) {        
        try {
          process.send(url);
          process.disconnect();
        } catch (err) {
          console.error("wikipedia_worker.js: [error sending results] " + err.message);
          process.disconnect();
        }
      } else {
        console.error("wikipedia_worker.js: [error calling wikipedia.getMainThumbnail()] " + error);
        process.disconnect();
      }

    });

  }

});
 
process.on('error', function (err){
  console.error("wikipedia_worker.js: " + err.message + "\n" + err.stack);
  process.disconnect();
});