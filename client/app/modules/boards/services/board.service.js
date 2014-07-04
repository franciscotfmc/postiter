'use strict'

angular.module('boards').service('Board', ['$http', '$q',
  function($http, $q) {

    this.get = function() {
      return $http.get('/api/boards');
    };

    this.show = function(id) {
      return $http.get('/api/board/' + id);
    };

    this.create = function(board) {
      return $http.post('/api/boards', board);
    }

    this.delete = function(boardId) {
      return $http.delete('/api/board/' + boardId);
    }

    this.blur = function(boardId) {
      return $http.post('/api/board/' + boardId + '/blur');
    }

    this.addMember = function(boardId, member) {
      return $http.post('/api/board/' + boardId + '/members', {
        member: member
      });
    }

    this.deleteMember = function(boardId, member) {
      return $http.post('/api/board/' + boardId + '/members/remove', {
        member: member
      });
    }

    this.toggleVisibility = function(board) {
      if (board.visibility == 'blurry') {
        board.visibility = 'visible';
      } else {
        board.visibility = 'blurry';
      }
    }

  }
]);
