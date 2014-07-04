'use strict'

angular.module('boards').controller('MembersCtrl', ['$scope', '$location', '$routeParams', 'User', 'Board', 'socket',

	function($scope, $location, $routeParams, User, Board, socket) {
		$scope.toggleShowMembers = function() {
			$scope.showMembers = !$scope.showMembers;
		}

		$scope.addMember = function($item, $model, $label) {
			Board.addMember($scope.board._id, $item).success(function(member) {
				$scope.friend.selected = null;
				$scope.board.users.push(member);
				membersPushEvents(member).new();
			}).error(function(data, status, headers, config) {
				$scope.friend.selected = null;
			});
		}

		$scope.deleteMember = function(member) {
			var remove = function() {
				Board.deleteMember($scope.board._id, member).success(function(data) {
					membersPushEvents(member).delete();
					deleteMemberFromScope(member);
				});
			}

			remove();
		}

		socket.on('new-member', function(data) {
			$scope.board.users.push(data.member);
		});

		socket.on('delete-member', function(data) {
			deleteMemberFromScope(data.member);
		});

		var membersPushEvents = function(member) {
			var emitMemberEvent = function(name) {
				socket.emit(name, {
					room: $routeParams.id,
					member: member
				});
			}

			return {
				new: function() {
					emitMemberEvent('new-member');
				},

				delete: function() {
					emitMemberEvent('delete-member');
				}
			}
		}

		var deleteMemberFromScope = function(member) {
			member = $scope.board.users.filter(function(user){
				return member.facebook.id === user.facebook.id;
			})[0];
			var index = $scope.board.users.indexOf(member);
			$scope.board.users.splice(index, 1);
		}

		User.getFacebookFriends().success(function(data) {
			$scope.friends = data;
		});
	}
]);
