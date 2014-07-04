'use strict';

angular.module('boards', [
	'ngSanitize',
	'ngRoute',
	'ngDragDrop'
])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider
				.when('/boards', {
					templateUrl: 'modules/boards/views/boards.html',
					controller: 'BoardsCtrl'
				})
				.when('/board/:id', {
					templateUrl: 'modules/boards/views/board.html',
					controller: 'BoardCtrl'
				})
				.otherwise({
					redirectTo: '/boards'
				});
		}
	]);
