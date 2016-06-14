(function() {
  'use strict';

  angular.module('myApp').factory('TaskService',
    ['$q', '$http', '$rootScope', function ($q, $http, $rootScope) {

      var Obj = {}, tasks = false;

      Obj.bindTasks = function(userID) {
        var deferred = $q.defer();
        $http.get('/user/' + userID + '/tasks/')
          .success(function(data) {
            tasks = data;
            deferred.resolve();
          })
          .error(function(error) {
            deferred.reject();
          });
          return deferred.promise;
      };

      Obj.getUserTasks = function() { return tasks; };

      Obj.addTask = function(userID, title, description, deadline, priority, severity, donation, text) {
        var deferred = $q.defer();

        $http.post('/user/' + userID + '/task/', {
          title: title,
          description: description,
          deadline: deadline,
          priority: priority,
          punishment_type: {
            donation: donation,
            text_message: text
          }
        })

          .success(function(data, status) {
            if (status === 200) deferred.resolve();
            else deferred.reject();
          })

          .error(function(data) { deferred.reject(); });

        return deferred.promise;
      };

      Obj.getSingleTask = function(userID, taskID) {
        return $http.get('/user/' + userID + '/task/' + taskID);
      };

      return Obj;
  }]);
}());
