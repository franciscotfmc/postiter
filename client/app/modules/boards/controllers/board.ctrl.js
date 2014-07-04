'use strict';

angular.module('boards')
  .controller('BoardCtrl', ['$scope', '$location', '$routeParams', 'Board', 'Card', 'socket', 'User',
    function($scope, $location, $routeParams, Board, Card, socket, User) {
      $scope.board = {};
      $scope.showMembers = true;
      $scope.friends = [];
      $scope.friend = {};

      $scope.create = function() {
        if (!$scope.board.cards)
          $scope.board.cards = [];

        $scope.board.cards.push({
          meta: {
            index: $scope.board.cards.length,
            text: '',
            thumb: true,
          },
          style: {
            edit: false,
            hover: false,
            expand: false,
            transparent: false,
            color: 'green'
          }
        });
      }

      $scope.save = function(card) {
        var update = function() {
          Card.update($scope.board._id, card).success(cbUpdateSuccess);
        }

        var cbUpdateSuccess = function(data) {
          updateScope(data);
          cardPushEvents(data).update();
        }

        var save = function() {
          Card.save($scope.board._id, card).success(cbSaveSuccess);
        }

        var cbSaveSuccess = function(data) {
          updateScope(data);
          cardPushEvents(data).new();
        }

        var updateScope = function(data) {
          var card = findCardByIndex(data.meta.index);
          var index = getIndexFor(card);
          $scope.board.cards[index] = data;
          $scope.board.cards[index].style.edit = false;
          $scope.board.cards[index].style.expand = false;
          $scope.board.cards[index].style.hover = false;
        }

        if (card._id) {
          update(card);
        } else {
          save(card);
        }
      }

      $scope.delete = function(card) {
        var remove = function() {
          Card.delete($scope.board._id, card).success(function(data) {
            deleteCardFromScope(card);
            cardPushEvents(card).delete();
          });
        }

        if (card._id) {
          remove();
        } else {
          deleteCardFromScope(card);
        }
      }

      $scope.dragStop = function(event, ui, card, $index) {};

      $scope.dragStart = function(event, ui, card) {};

      $scope.mouseover = function(card) {
        card.style.hover = true;
      }

      $scope.mouseleave = function(card) {
        card.style.hover = false;
      }

      $scope.expand = function($event, card) {
        card.style.expand = !card.style.expand;
      }

      $scope.edit = function($event, card) {
        normalizeCards();
        card.style.edit = true;
      }

      $scope.toggleThumb = function(card) {
        card.meta.thumb = !card.meta.thumb;
      }

      $scope.toggleColor = function(card) {
        switch (card.style.color) {
          case 'green':
            card.style.color = 'yellow';
            break;
          case 'yellow':
            card.style.color = 'red';
            break;
          case 'red':
            card.style.color = 'green';
        }
      }

      $scope.$on('create-card', function(event) {
        $scope.create();
      });

      $scope.$on('blur-cards', function() {
        Board.toggleVisibility($scope.board);
        Board.blur($scope.board._id).success(function() {
          socket.emit('blur-cards', {
            room: $routeParams.id
          });
        })
      });

      socket.on('new-card', function(data) {
        $scope.board.cards.push(data.card);
        normalizeCard(data.card);
      });

      socket.on('delete-card', function(data) {
        deleteCardFromScope(data.card);
      });

      socket.on('update-card', function(data) {
        var card = findCardByIndex(data.card.meta.index);
        normalizeCard(card);
        var index = getIndexFor(card);
        $scope.board.cards[index] = data.card;
      });

      socket.on('blur-cards', function() {
        Board.toggleVisibility($scope.board);
      });

      var cardPushEvents = function(card) {
        var emitCardEvent = function(name) {
          socket.emit(name, {
            room: $routeParams.id,
            card: card
          });
        }

        return {
          new: function() {
            emitCardEvent('new-card');
          },

          update: function() {
            emitCardEvent('update-card');
          },

          delete: function() {
            emitCardEvent('delete-card');
          },

          blur: function() {
            emitCardEvent('blur-cards');
          }
        }
      }

      var getIndexFor = function(card) {
        return $scope.board.cards.indexOf(card);
      }

      var findCardByIndex = function(index) {
        return $scope.board.cards.filter(function(card) {
          return index == card.meta.index;
        })[0];
      }

      var deleteCardFromScope = function(card) {
        var index = $scope.board.cards.indexOf(card);
        $scope.board.cards.splice(index, 1);
      }

      var normalizeCards = function() {
        for (var i in $scope.board.cards) {
          normalizeCard($scope.board.cards[i]);
        }
      };

      var normalizeCard = function(card) {
        card.style.edit = false;
        card.style.hover = false;
        card.style.expand = false;
      }

      Board.show($routeParams.id).then(function(result) {
        if (result.data.status == 1)
          $location.path('');
        else {
          $scope.board = result.data.output;
          normalizeCards();

          $scope.$emit('board-title', $scope.board.title);

          $scope.$on('$routeChangeStart', function(next, current) {
            socket.emit('disconnect-board', $scope.board);
          });

          socket.emit('connect-board', $scope.board);
        }
      });
    }
  ]);
