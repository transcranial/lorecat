'use strict';

angular.module('lorecatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'angucomplete',
  'ui.bootstrap',
  'mgcrea.ngStrap',
  'mgcrea.ngStrap.helpers.dimensions',
  'duScroll'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/tos', {
        templateUrl: 'partials/tos'
      })
      .when('/privacy', {
        templateUrl: 'partials/privacy'
      })
      .when('/help', {
        templateUrl: 'partials/help'
      })
      .when('/contact', {
        templateUrl: 'partials/contact'
      })
      .when('/account', {
        templateUrl: 'partials/account',
        controller: 'AccountCtrl',
        authenticate: true
      })
      .when('/quiz/wikipedia/:articleTitle', {
        templateUrl: 'partials/quiz',
        controller: 'QuizCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });