'use strict'

angular.module('feedback').controller('FeedbackCtrl', ['$scope', '$location', 'Feedback',

  function($scope, $location, Feedback) {
    $scope.feed = {}

    $scope.create = function() {
      Feedback.create($scope.feed).then(function(result) {
        $location.path('/feedback/thanks');
      });
    }
  }
]);
