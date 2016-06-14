(function() {
  'use strict';

  angular.module('myApp').directive('bgTrans', [function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {

        element.css({
          'background-color': 'rgba(58, 51, 38, 0.3)'
        });

      }
    };
  }]);
})();
