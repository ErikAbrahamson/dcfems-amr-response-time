(function() {
  'use strict';

  angular.module('myApp').controller('bindController',
    ['$scope', '$mdToast', '$mdDialog', '$rootScope', '$location', 'AuthService', 'TaskService',
    function ($scope, $mdToast, $mdDialog, $rootScope, $location, AuthService, TaskService) {

      $rootScope.getTasks = function () {

        $scope.error = false;
        $rootScope.tasks = null;

        TaskService.bindTasks($rootScope.currentUser._id)

          .then(function () {
            $rootScope.tasks = TaskService.getUserTasks();
            $location.path('/');
          })

          .catch(function() {
            $scope.error = true;
          });

      };
  }]);
}());
