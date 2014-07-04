'use strict'

angular.module('boards').service('Card', ['$http', '$q',
  function($http, $q) {

    this.update = function(boardId, card) {
      return $http.put('/api/board/' + boardId + '/cards', {
        card: card
      });
    }

    this.save = function(boardId, card) {
      return $http.post('/api/board/' + boardId + '/cards', {
        card: card
      });
    }

    this.delete = function(boardId, card) {
      return $http.post('/api/board/' + boardId + '/card/remove', {
        card: card
      });
    }
  }
]);
