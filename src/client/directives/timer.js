(function() {
  'use strict';

  angular.module('myApp').directive('timer', ['Util', '$interval',
  function(Util, $interval) {
    return {
      restrict: 'A',
      scope: {
        deadline: '=?'
      },
      link: function($scope, element) {
        $scope.future = new Date($scope.deadline);
        $interval(function() {
          $scope.diff = null;
          $scope.diff = Math.floor(($scope.future.getTime() - new Date().getTime()) / 1000);
          return element.text(Util.dhms($scope.diff));
        }, 1000);
      }
    };
  }])
  .factory('Util', [function() {
    return {
      dhms: function(t) {
        var days, hours, minutes, seconds;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;
        return [days + ' days\n', hours + ' hours\n', minutes + ' minutes\n', seconds + ' seconds\n'].join(' ');
      }
    };
  }]);
})();
