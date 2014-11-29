'use strict';

angular.module('lorecatApp')
  .factory('QuizContent', function ($resource) {
    return $resource('/api/quiz/wikipedia/:articleTitle', {
      articleTitle: '@articleTitle'
    });
  });