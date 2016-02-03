describe('sameHeight directive', function () {
	'use strict';

	var $compile,
		element,
		$rootScope,
		resizeCallback,
		timeoutCallback,
		$window;

	beforeEach(function () {
		module('partnermarketing.sameHeight');

		$window = {
			clearTimeout: function() {
			},
			parseInt: function(number) {
				return window.parseInt(number);
			},
			matchMedia: function(query) {
				expect(query).toBe('(min-width: 300px)');
				return true;
			},
			getComputedStyle: function(element) {
				return {
					getPropertyValue: function(property) {
						if (!element.mockComputedStyle) {
							return undefined;
						}
						return element.mockComputedStyle[property];
					},
				};
			}
		};

		module(function($provide) {
			$provide.value('$window', $window);
		});
	});

	beforeEach(inject(function(_$compile_, _$rootScope_, _$window_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$window = _$window_;

		$window.addEventListener = function(eventType, _eventCallback_) {
			expect(eventType).toBe('resize');
			resizeCallback = _eventCallback_;
		};
		spyOn($window, 'addEventListener').andCallThrough();

		$window.setTimeout = function(_eventCallback_) {
			timeoutCallback = _eventCallback_;
		};
		spyOn($window, 'setTimeout').andCallThrough();
	}));

	it('does not add a resize callback if the same-height attribute has no targets', function() {
		element = $compile('<div same-height=""> </div>')($rootScope);
		$rootScope.$digest();

		expect($window.addEventListener).not.toHaveBeenCalled();
	});

	it('does not add a resize callback if the same-height attribute has only whitespace', function() {
		element = $compile('<div same-height="	 "> </div>')($rootScope);
		$rootScope.$digest();

		expect($window.addEventListener).not.toHaveBeenCalled();
	});

	it('does not add a resize callback if the same-height attribute has invalid syntax', function() {
		element = $compile('<div same-height="invalid syntax"> </div>')($rootScope);
		$rootScope.$digest();

		expect($window.addEventListener).not.toHaveBeenCalled();
	});

	it('adds a resize callback if the same-height attribute has targets', function() {
		element = $compile('<div same-height="query { target }"> </div>')($rootScope);
		$rootScope.$digest();

		expect($window.addEventListener).toHaveBeenCalled();
	});

	it('queues up to resize the elements soon after the directive is created', function() {
		element = $compile('<div same-height="* { h1 }"> </div>')($rootScope);
		$rootScope.$digest();

		expect($window.setTimeout.calls.length).toBe(1);
	});

	it('ignores elements that don\'t match the selector', function() {
		element = $compile('<div same-height="* { h1 }"> <h1>line 1</h1> <p>paragraph</p> </div>')($rootScope);
		$rootScope.$digest();

		expect($window.setTimeout.calls.length).toBe(1);
		resizeCallback();
		expect($window.setTimeout.calls.length).toBe(2);
		timeoutCallback();

		expect(element[0].querySelector('p').outerHTML).not.toContain('style');
	});

	it('ignores hidden elements', function() {
		element = $compile('<div same-height="* { h1 }"> <h1 style="display: none;">a</h1> </div>')($rootScope);
		$rootScope.$digest();

		element[0].querySelector('h1').offsetParent_ = null;

		expect($window.setTimeout.calls.length).toBe(1);
		resizeCallback();
		expect($window.setTimeout.calls.length).toBe(2);
		timeoutCallback();

		expect(element.html()).toContain('style="display: none;"');
		expect(element.html()).not.toContain('height');
	});

	it('does not affect the wrong elements', function() {
		element = $compile('<div same-height="* { h1 }"> <h1>line 1</h1> <h2>line 2</h2></div>')($rootScope);
		$rootScope.$digest();

		element[0].querySelectorAll('h1')[0].offsetParent_ = '12';
		element[0].querySelectorAll('h2')[0].offsetParent_ = '24';

		expect($window.setTimeout.calls.length).toBe(1);
		resizeCallback();
		expect($window.setTimeout.calls.length).toBe(2);
		timeoutCallback();

		expect(element.html()).toMatch(/style="height: \d+px;? *">line 1/);
		expect(element.html()).not.toMatch(/style="height: \d+px;? *">line 2/);
	});

	it('always applies the pseudo-media-query "*"', function() {
		element = $compile('<div same-height="* { h1 }"> <h1>line 1</h1> <h1>line 2 <br /> line 3</h1> <p>paragraph</p> </div>')($rootScope);
		$rootScope.$digest();

		element[0].querySelectorAll('h1')[0].offsetParent_ = '12';
		element[0].querySelectorAll('h1')[1].offsetParent_ = '24';

		expect($window.setTimeout.calls.length).toBe(1);
		resizeCallback();
		expect($window.setTimeout.calls.length).toBe(2);
		timeoutCallback();

		expect(element.html()).toMatch(/style="height: \d+px;? *">line 1/);
		expect(element.html()).toMatch(/style="height: \d+px;? *">line 2/);
	});

	it('does not set the height or error in old browsers that don\'t support window.matchMedia', function() {
		element = $compile('<div same-height="(min-width: 300px) { h1 }"> <h1>header</h1> </div>')($rootScope);
		$rootScope.$digest();

		$window.matchMedia = undefined;

		element[0].querySelectorAll('h1')[0].offsetParent_ = '12';

		expect($window.setTimeout.calls.length).toBe(1);
		resizeCallback();
		expect($window.setTimeout.calls.length).toBe(2);
		timeoutCallback();

		expect(element.html()).toMatch(/style="height: auto; *">header/);
	});

	it('does not set the height when the media query fails', function() {
		element = $compile('<div same-height="(min-width: 300px) { h1 }"> <h1>header</h1> </div>')($rootScope);
		$rootScope.$digest();

		$window.matchMedia = function(query) {
			expect(query).toBe('(min-width: 300px)');
			return false;
		};
		spyOn($window, 'matchMedia').andCallThrough();

		element[0].querySelectorAll('h1')[0].offsetParent_ = '12';

		expect($window.setTimeout.calls.length).toBe(1);
		resizeCallback();
		expect($window.setTimeout.calls.length).toBe(2);
		timeoutCallback();

		expect($window.matchMedia.calls.length).toBe(1);
		expect(element.html()).toMatch(/style="height: auto; *">header/);
	});

	it('sets the height when the media query passes', function() {
		element = $compile('<div same-height="(min-width: 300px) { h1 }"> <h1>header 1</h1> <h1>header 2</h1> </div>')($rootScope);
		$rootScope.$digest();

		element[0].querySelectorAll('h1')[0].offsetParent_ = '12';
		element[0].querySelectorAll('h1')[0].mockComputedStyle = {height: 24};
		element[0].querySelectorAll('h1')[1].offsetParent_ = '12';
		element[0].querySelectorAll('h1')[1].mockComputedStyle = {height: 32};

		expect($window.setTimeout.calls.length).toBe(1);
		resizeCallback();
		expect($window.setTimeout.calls.length).toBe(2);
		timeoutCallback();

		expect(element.html()).toMatch(/style="height: 32px;? *">header 1/);
		expect(element.html()).toMatch(/style="height: 32px;? *">header 2/);
	});
});
