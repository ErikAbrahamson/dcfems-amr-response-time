(function() {
  'use strict';

  angular.module('myApp').controller('dialogTaskController',
    ['$scope', '$mdDialog', '$mdMedia',
    function ($scope, $mdDialog, $mdMedia) {

    $scope.customFullscreen = $mdMedia('sm');

    $scope.showForm = function(event) {
      $mdDialog.show({
        scope: $scope,
        preserveScope: true,
        controller: function($mdDialog) {
          $scope.hide = function() { $mdDialog.hide(); };
          $scope.cancel = function() { $mdDialog.cancel(); };
        },
        templateUrl: '../partials/newtask.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose:true,
        fullscreen: $mdMedia('sm') && $scope.customFullscreen
      });

      $scope.$watch(function() {
        return $mdMedia('sm');
      }, function(sm) {
        $scope.customFullscreen = (sm === true);
      });

    };
  }]);

}());
