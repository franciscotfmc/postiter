'use strict'

angular.module('services').service('User', ['$http', '$q',
  function($http, $q) {

    this.getCurrentUser = function() {
      return $http.get('/api/users/me');
    }

    this.getFacebookFriends = function() {
      return $http.get('/api/fb/friends');
    }
  }
]);
