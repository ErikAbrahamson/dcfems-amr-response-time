(function() {
  'use strict';

  angular.module('myApp').controller('taskController',
    ['$scope', '$mdToast', '$mdDialog', '$rootScope', '$location', 'AuthService', 'TaskService',
    function ($scope, $mdToast, $mdDialog, $rootScope, $location, AuthService, TaskService) {

      $scope.addTask = function () {
        $scope.successToast = function($event) {
          $mdToast.show(
            $mdToast.simple()
            .content('Task added!')
            .position('top right')
            .hideDelay(3000)
          );
        };

        $scope.errorToast = function($event) {
          $mdToast.showSimple('Sorry, something went wrong. Please try again');
        };

        $scope.error = false;

        TaskService.addTask(
          $rootScope.currentUser._id,
          $scope.taskForm.title,
          $scope.taskForm.description,
          $scope.taskForm.deadline,
          $scope.taskForm.priority
        )

        .then(function () {
          $rootScope.getTasks();
          $scope.successToast();
          $mdDialog.hide();
          $location.path('/');
        })

        .catch(function () {
          $scope.errorToast();
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });
      };
  }]);
}());
