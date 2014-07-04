'use strict';

angular.module('layout')
  .controller('LayoutCtrl', ['$scope', '$location', 'User', 'Board',
    function($scope, $location, User, Board) {
      $scope.active = 'boards';
      $scope.board = '';

      $scope.new = function() {
        $scope.$broadcast("create-card");
      }

      $scope.blur = function() {
        Board.toggleVisibility($scope.currentBoard);
        $scope.$broadcast("blur-cards");
      }

      var fetchBoard = function() {
        Board.show($scope.board).then(function(result) {
          $scope.currentBoard = result.data.output;
        });
      }

      var fetchUser = function() {
        User.getCurrentUser().then(function(result) {
          $scope.currentUser = result.data;
        });
      }

      $scope.$on('$routeChangeStart', function(next, current) {
        if (current.params.id)
          $scope.board = current.params.id;

        if ($location.path().search(/^\/board\/(?:([^\/]+))$/) == 0) {
          $scope.active = 'board';
          fetchBoard();
        } else {
          $scope.active = 'boards';
        }
      });

      $scope.$on('board-title', function(event, value) {
        $scope.title = value;
      });

      fetchUser();
    }
  ]);
