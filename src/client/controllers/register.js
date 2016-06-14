(function() {
  'use strict';

  angular.module('myApp').controller('registerController',
    ['$scope', '$mdDialog', '$mdToast', '$location', 'AuthService',
    function ($scope, $mdDialog, $mdToast, $location, AuthService) {

      $scope.register = function () {

        $scope.successToast = function($event) {
          $mdToast.showSimple('Thanks for registering!');
        };

        $scope.errorToast = function($event) {
          $mdToast.showSimple('Sorry, this username already exists');
        };

        $scope.error = false;
        $scope.disabled = true;

        AuthService.register(
          $scope.registerForm.username,
          $scope.registerForm.password,
          $scope.registerForm.email,
          $scope.registerForm.phone,
          $scope.registerForm.tasks
        )
        .then(function () {
          $scope.successToast();
          $mdDialog.hide();
          $location.path('/login');
          $scope.disabled = false;
          $scope.registerForm = {};
        })

        .catch(function () {
          $scope.errorToast();
          $scope.error = true;
          $scope.errorMessage = "Something went wrong!";
          $scope.disabled = false;
          $scope.registerForm = {};
        });
      };
  }]);
}());
