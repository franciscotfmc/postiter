'use strict'

angular.module('directives').directive('gravatar', ['md5',
	function(md5) {
		return {
			templateUrl: 'modules/directives/templates/gravatar.html',
			scope: {
				email: '@',
				name: '@',
				height: '@',
				fb: '@',
				width: '@',
				click: '&',
				remove: '@'
			},
			link: function(scope, elem, attr) {
				if (scope.email) {
					scope.emailHash = md5(scope.email);
					scope.showGravatar = true;
				} else {
					scope.showFacebook = true;
				}
			}
		}
	}
]);
