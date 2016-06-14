(function() {
  'use strict';

  angular.module('myApp').controller('tileController',
    ['$scope', '$rootScope', '$location', 'TaskService', 'AuthService',
    function($scope, $rootScope, $location, TaskService, AuthService) {

      $rootScope.currentUser = AuthService.getUserStatus();
      TaskService.bindTasks($rootScope.currentUser._id)

        .then(function () {

          $rootScope.tasks = TaskService.getUserTasks();
          $rootScope.tiles = (function() {
            var tiles = [];
            for (var i = 0; i < $rootScope.tasks.length; i++) {

              tiles.push({
                title: $rootScope.tasks[i].title,
                description: $rootScope.tasks[i].description,
                deadline: $rootScope.tasks[i].deadline,
                priority: $rootScope.tasks[i].priority,
                colspan: getSize($rootScope.tasks[i].priority),
                color: randomColor(),
                rowspan: getSize($rootScope.tasks[i].priority),
              });
            }
            return tiles;
          })();
          $location.path('/');
        });

      var colors = [
          '#F44336',
          '#EF5350',
          '#E040FB',
          '#009688',
          '#2E7D32',
          '#00796B',
          '#827717',
          '#A1887F',
          '#795548',
          '#607D8B',
          '#546e7a',
          '#78909C',
          '#9e9d24',
          '#78909C',
        ];

        function getSize(priority) {
          if (priority === 3) return 3;
          else if (priority === 2) return 2;
          else if (priority === 1) return 1;
        }

        function randomColor() {
          return colors[Math.floor(Math.random() * colors.length)];
        }

        $scope.convertDate = function(deadline) {
          return moment(deadline).format('MMMM Do YYYY, h:mm:ss');
        };

  }]);
}());
