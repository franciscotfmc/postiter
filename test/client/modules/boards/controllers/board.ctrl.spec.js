'use strict';

describe('BoardCtrl', function() {

	beforeEach(module('postiter'));

	var BoardCtrl, scope, $httpBackend, $location, $routeParams;

	var board = {
		id: 1,
		title: 'New Board',
		cards: []
	};

	var responseSuccess = {
		status: 2,
		output: board
	};

	var responseCardSuccess = {
		meta: {
			index: 0,
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
	};

	responseCardSuccess._id = 1;

	beforeEach(inject(function(_$httpBackend_, $controller, $rootScope,
		_$location_, _$routeParams_) {

		$httpBackend = _$httpBackend_;
		$location = _$location_;
		$routeParams = _$routeParams_;
		$routeParams.id = 1;
		scope = $rootScope.$new();

		$httpBackend.expectGET('/api/board/' + board.id)
			.respond(responseSuccess);

		BoardCtrl = $controller('BoardCtrl', {
			$scope: scope,
			$routeParams: $routeParams
		});
	}));

	it('should show board', function() {
		expect(scope.board).toEqualData({});
		$httpBackend.flush();
		expect(scope.board).toEqualData(board);
	});

	it('should create a card', function() {
		expect(scope.board.cards).toBeUndefined();
		scope.create();
		expect(scope.board.cards.length).toBe(1);
	});

	it('should save a card', function() {
		$httpBackend.expectPOST('/api/board/' + board.id + '/cards')
			.respond(responseCardSuccess);
		scope.board._id = 1;
		scope.create();
		scope.save(scope.board.cards[0]);
		$httpBackend.flush();
	});

	describe('Removing cards from board', function() {
		it('should remove a card without XHR', function() {
			scope.board._id = 1;
			scope.create();
			expect(scope.board.cards.length).toBe(1);
			scope.delete(scope.board.cards[0]);
			expect(scope.board.cards.length).toBe(0);
		});

		it('should remove a card with XHR', function() {
			$httpBackend.expectPOST('/api/board/' + board.id + '/cards')
				.respond(responseCardSuccess);
			$httpBackend.expectPOST('/api/board/' + board.id + '/card/remove')
				.respond(responseCardSuccess);
			scope.board._id = 1;
			scope.create();
			scope.save(scope.board.cards[0]);
			scope.delete(responseCardSuccess);
			$httpBackend.flush();
		});
	});

});
