'use strict'

angular.module('feedback').service('Feedback', ['$http', '$q',
  function($http, $q) {
    this.create = function(feed) {
      return $http.post('/api/feedback', feed);
    }
  }
]);
