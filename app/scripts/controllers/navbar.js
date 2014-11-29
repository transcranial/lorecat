'use strict';

angular.module('lorecatApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
    
    $scope.isMainPage = function() {
      return '/' === $location.path();
    };
  });
