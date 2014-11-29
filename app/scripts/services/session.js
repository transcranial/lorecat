'use strict';

angular.module('lorecatApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
