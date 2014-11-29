'use strict';

angular.module('lorecatApp')
  .controller('MainCtrl', function ($scope, $location) {

    $scope.createQuiz = function() {
      if ($scope.pageSearchTitle) {
        if ($scope.articleTitle !== $scope.pageSearchTitle.title) {
          $location.path('/quiz/wikipedia/' + $scope.pageSearchTitle.title.replace(/ /g, '_'));
        }
      }
      return;
    };
    
  });
