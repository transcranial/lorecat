'use strict';

angular.module('lorecatApp')
  .controller('QuizCtrl', function ($scope, $route, $routeParams, $sce, QuizContent, $window, $http, $location, $cookieStore, $document) {

    $scope.createQuiz = function() {
      if ($scope.pageSearchTitle) {
        if ($scope.articleTitle !== $scope.pageSearchTitle.title) {
          $location.path('/quiz/wikipedia/' + $scope.pageSearchTitle.title.replace(/ /g, '_'));
        }
      }
      return;
    };

    $scope.refreshQuiz = function() {
      return $route.reload();
    };

    $scope.loadSettings = function() {
      $scope.termLimit = $cookieStore.get('termLimit') || 20;
      $scope.articleLimit = $cookieStore.get('articleLimit') || 10;
      $scope.percentQuiz = $cookieStore.get('percentQuiz') || 100;
    };

    $scope.saveSettings = function() {
      $cookieStore.put('termLimit', $scope.termLimit);
      $cookieStore.put('articleLimit', $scope.articleLimit);
      $cookieStore.put('percentQuiz', $scope.percentQuiz);
    };

    // Initialize quiz controller
    $scope.articleTitle = $routeParams.articleTitle.replace(/_/g, ' ');
    $scope.articleTitleForUrl = $routeParams.articleTitle;
    $scope.loaded = false;
    $scope.loadingError = false;
    $scope.quizItemCounts = {
      numCorrect: 0,
      totNumber: 0
    };
    $scope.loadSettings();

    // Get page thumbnail image
    var thumbnailWidth = Math.round(angular.element($window).width() / 3);
    $http.get('/api/quiz/wikipedia/thumbnail/' + $routeParams.articleTitle + '?thumbnailWidth=' + thumbnailWidth).success(function (thumbnailURL) {
      $scope.thumbnailURL = thumbnailURL;
    });

    // Get page contents
    QuizContent.get({
      articleTitle: $routeParams.articleTitle,
      articleLimit: $scope.articleLimit,
      termLimit: $scope.termLimit,
      tfidfLimit: 1
    }, function (quizContent) {
      $scope.quizSections = quizContent.sections;
      $scope.quizTerms = quizContent.terms;
      $scope.loaded = true;
    }, function (error) {
      $scope.loaded = true;
      $scope.loadingError = true;
      console.log('error loading content: ' + error);
    });

    $scope.scrollToSection = function (sectionIndex) {
      var sectionElement = angular.element(document.getElementById('sec-' + String(sectionIndex)));
      var offset = 10;
      var duration = 800;
      var easeInOutQuad = function (t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; };
      $document.scrollToElement(sectionElement, offset, duration, easeInOutQuad);
    };
    
  });
