(function() {
  'use strict';

  angular.module('myApp').controller('gridController',
    ['$scope', '$rootScope','$mdToast', '$location', 'AuthService',
    function ($scope, $rootScope, $mdToast, $location, AuthService) {

      var COLORS = [];
        this.colorTiles = (function() {
          var tiles = [];
          for (var i = 0; i < 46; i++) {
            tiles.push({
              color: randomColor(),
              colspan: randomSpan(),
              rowspan: randomSpan()
            });
          }
          return tiles;
        })();
        function randomColor() {
          return COLORS[Math.floor(Math.random() * COLORS.length)];
        }
        function randomSpan() {
          var r = Math.random();
          if (r < 0.8) {
            return 1;
          } else if (r < 0.9) {
            return 2;
          } else {
            return 3;
          }
        }

    }]);
}());
