'use strict';

angular.module('lorecatApp')

  /**
   * Element for quiz input item
   */
  .directive('quizzify', function ($compile) {
    return {
      restrict: 'A',
      replace: false,
      link: function(scope, element, attrs) {

        if (scope.quizTerms.length === 0) {
          element.append(scope.section.sectionText);
          return;
        }

        var quizTermsPattern = new RegExp('\\b(' + scope.quizTerms.join('|') + ')\\b', 'i');
        
        var preMatchText = '',
          matchText = '',
          postMatchText = scope.section.sectionText;
        
        var match = quizTermsPattern.exec(postMatchText);
        
        while (match !== null) {

          preMatchText = postMatchText.substring(0, match.index);
          if (preMatchText) {
            element.append(preMatchText);
          }
          if (Math.random() < (scope.percentQuiz / 100.0)) {
            matchText = '<quiz-input id="quiz-item-' + scope.quizItemCounts.totNumber + '" item-index="' + scope.quizItemCounts.totNumber + '" answer="' + match[0] + '" ></quiz-input>';
            element.append($compile(matchText)(scope));
            scope.quizItemCounts.totNumber += 1;
          } else {
            element.append(match[0]);
          }
          postMatchText = postMatchText.substring(match.index + match[0].length);
          match = quizTermsPattern.exec(postMatchText);
          
        }
        if (postMatchText) {
          element.append(postMatchText);
        }
        if (scope.$last) {
          element.append('<br><br>');
        }
      }
    };
  })
  .directive('quizInput', function () {
    return {
      restrict: 'E',
      replace: true,
      template: '<input class="quiz-input-item" spellcheck="false" />',
      link: function(scope, element, attrs) {
        
        element.css({
          'width': String(attrs.answer.length * 20) + 'px'
        });

        var correctAnswerTrigger = false;

        element.on('keyup', function () {
          var a = this.value.toLowerCase();
          var b = attrs.answer.toLowerCase();
          if (a === b) {
            element.css({
              'color': '#77C4D3',
              'border-bottom': '2px solid #77C4D3',
              'pointer-events': 'none'
            });
            element.blur();
            this.value = attrs.answer;
            var nextQuizItemElement = angular.element('#quiz-item-' + String(parseInt(attrs.itemIndex)+1));
            if (nextQuizItemElement[0]) {
              nextQuizItemElement.focus();
            }
            if (!correctAnswerTrigger) { // to account for simultaneous keyup events
              scope.$apply(function () {
                return scope.quizItemCounts.numCorrect += 1;
              });
            }
            correctAnswerTrigger = true;
          } else if (a.length > 0 && (new RegExp('^' + a)).test(b)) {
            element.css({
              'color': '#F6F792',
              'border-bottom': '2px dotted #F6F792'
            });
          } else if (a.length > 0) {
            element.css({
              'color': '#EA2E49',
              'border-bottom': '2px dotted #EA2E49'
            });
          } else {
            element.css({
              'color': '#EEEEEE',
              'border-bottom': '2px dotted #DAEDE2'
            });
          }
        });

      }
    };
  });