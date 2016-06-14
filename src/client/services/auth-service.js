(function() {
  'use strict';

  angular.module('myApp').factory('AuthService',
    ['$q', '$http', function ($q, $http) {

      var Obj = {}, user = false;

      Obj.isLoggedIn = function() {
        if (user) return true;
        else return false;
      };

      Obj.getUserStatus = function() { return user; };

      Obj.login = function(username, password) {
        var deferred = $q.defer();
        $http.post('/user/login', {
          username: username,
          password: password
        })
          .success(function(data, status) {
            if (status === 200) {
              user = data;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject();
            }
          })

          .error(function(data) {
            user = false;
            deferred.reject();
          });

        return deferred.promise;
      };

      Obj.logout = function() {
        var deferred = $q.defer();
        $http.get('/user/logout')

          .success(function (data) {
            user = false;
            deferred.resolve();
          })

          .error(function (data) {
            user = false;
            deferred.reject();
          });

        return deferred.promise;
      };

      Obj.register = function(usr, pw, email, phone) {
        var deferred = $q.defer();
        $http.post('/user/register', {
          username: usr,
          password: pw,
          email: email,
          phone: phone
        })

        .success(function(data, status) {
          if (status === 200) deferred.resolve();
          else deferred.reject();
        })

        .error(function(data) { deferred.reject(); });

      return deferred.promise;
    };
    return Obj;
  }]);
}());
