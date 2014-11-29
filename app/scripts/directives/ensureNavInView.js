'use strict';

angular.module('lorecatApp')
  .directive('ensureNavInView', function ($window) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var navActiveId = angular.element('.section-nav ul>li.active').attr('id');
        var processed = false;
        angular.element($window).bind('scroll', function () {
          if (!processed) {
            var activeNavElemPos = angular.element('.section-nav ul>li.active').position().top + angular.element('.section-nav').position().top;
            var activeNavElemHeight = angular.element('.section-nav ul>li.active').outerHeight();
            var windowHeight = angular.element(window).innerHeight();
            var sectionNavPos = angular.element('.section-nav').position().top;
            //console.log(activeNavElemPos + ' ' + activeNavElemHeight + ' ' + windowHeight + ' ' + sectionNavPos);
            if (activeNavElemPos + activeNavElemHeight > windowHeight) {
              angular.element('.section-nav').css({
                'top': String(sectionNavPos - activeNavElemPos - activeNavElemHeight + windowHeight - 20) + 'px'
              });
            } else if (activeNavElemPos < 0) {
              angular.element('.section-nav').css({
                'top': String(sectionNavPos + activeNavElemHeight) + 'px'
              });
            }
            processed = true;
          }
          if (angular.element('.section-nav ul>li.active').attr('id') !== navActiveId) {
            navActiveId = angular.element('.section-nav ul>li.active').attr('id');
            processed = false;
          }
        });

      }
    };
  });