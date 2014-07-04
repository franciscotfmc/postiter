'use strict';

angular.module('feedback', [
  'ngSanitize',
  'ngRoute'
])
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/feedback', {
          templateUrl: 'modules/feedback/views/feedback.html',
          controller: 'FeedbackCtrl'
        })
        .when('/feedback/thanks', {
          templateUrl: 'modules/feedback/views/thanks.html',
          controller: 'FeedbackCtrl'
        })
        .when('/donate', {
          templateUrl: 'modules/feedback/views/donate.html',
          controller: 'FeedbackCtrl'
        });
    }
  ]);
