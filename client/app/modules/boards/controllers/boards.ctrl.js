'use strict'

angular.module('boards').controller('BoardsCtrl', ['$scope', '$location', 'User', 'Board', 'socket',

  function($scope, $location, User, Board, socket) {

    $scope.currentUser = {};
    $scope.boards = [];
    $scope.board = {};

    $scope.create = function() {
      Board.create($scope.board).then(function(result) {
        $location.path('/api/board/' + result.data.id);
      });
    }

    $scope.delete = function(board) {
      Board.delete(board._id).then(function(result) {
        var index = $scope.boards.indexOf(board);
        $scope.boards.splice(index, 1);
      });
    }

    $scope.$on('create-card', function(event) {
      $scope.create();
    });

    User.getCurrentUser().then(function(result) {
      $scope.currentUser = result.data;
    });

    Board.get().then(function(result) {
      if (result.data.status == 1)
        $location.path('');
      else
        $scope.boards = result.data.output;
    });
  }
]);
