(function() {
  'use strict';

  angular.module('myApp').directive('backImg', [function() {
    return {
      restrict: 'A',
      link: function($scope, element, attrs) {

        $scope.url = attrs.backImg;
        element.css({
          'background-image': 'url(' + $scope.url + ')',
          'background-size' : 'cover'
        });

      }
    };
  }]);
})();
