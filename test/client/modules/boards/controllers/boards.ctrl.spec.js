'use strict';

describe('BoardsCtrl', function() {

  beforeEach(module('postiter'));

  var BoardsCtrl, scope, $httpBackend, $location;

  var user = {
    name: 'Francisco',
    email: 'f.thiene@gmail.com'
  };

  var boards = [{
    title: 'My first board'
  }, {
    title: 'My second board'
  }];

  var board = {
    id: 1,
    title: 'New Board'
  };

  var responseSuccess = {
    status: 2,
    output: boards
  };

  beforeEach(inject(function(_$httpBackend_, $controller, $rootScope, _$location_) {
    $httpBackend = _$httpBackend_;
    $location = _$location_;
    scope = $rootScope.$new();

    $httpBackend.expectGET('/api/users/me')
      .respond(user);
    $httpBackend.expectGET('/api/boards')
      .respond(responseSuccess);

    BoardsCtrl = $controller('BoardsCtrl', {
      $scope: scope
    });
  }));

  it('should get logged user with its boards', function() {
    expect(scope.currentUser).toEqualData({});
    expect(scope.boards).toEqualData([]);
    $httpBackend.flush();
    expect(scope.currentUser).toEqualData(user);
    expect(scope.boards).toEqualData(boards);
  });

  it('should create a new board and redirect', function() {
    spyOn($location, 'path');
    $httpBackend.expectPOST('/api/boards')
      .respond(board);
    scope.create();
    $httpBackend.flush();
    expect($location.path).toHaveBeenCalledWith('/api/board/' + board.id);
  });
});
