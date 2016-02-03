angular.module('partnermarketing.sameHeight', []);

angular.module('partnermarketing.sameHeight').directive('sameHeight', ['$window', function ($window) {
	'use strict';

	function same(selector, element) {
		// Ensure we aren't calculating based on any previously forced heights.
		removeSame(selector, element);

		let greatestHeight = 0;

		const elements = findTargetElements(selector, element);

		for (let i = 0; i < elements.length; i++) {
			if (elements[i].innerHeight > greatestHeight) {
				greatestHeight = elements[i].innerHeight;
			}
		}

		elements.map((element) => element.style.height = String(greatestHeight) + 'px');
	}

	function removeSame(selector, element) {
		const elements = findTargetElements(selector, element);
		for (let i = 0; i < elements.length; i++) {
			elements[i].style.height = 'auto';
		}
	}

	const trimString = (string) => string.replace(/^ +/, '').replace(/ +$/, '');

	const findTargetElements = (selector, element) => Array(... element[0].querySelectorAll(selector)).filter((el) => !isHidden(el));

	function isHidden(element) {
		// `offsetParent_` is used by unit tests because `offsetParent` is read-only.
		if (element.hasOwnProperty('offsetParent_')) {
			return (element.offsetParent_ === null);
		} else {
			return (element.offsetParent === null);
		}
	}

	return {
		restrict: 'A',
		scope: {
			sameHeight: '@'
		},
		compile: function compile() {
			return {
				post: function postLink(scope, element) {
					if (!angular.isString(scope.sameHeight)) {
						return;
					}
					const targets = scope.sameHeight.split('}');
					if (targets.length < 2) {
						return;
					}

					const mediaQueriesAndTargets = [];
					for (let i = 0; i < targets.length; i++) {
						const mediaQuery = trimString(targets[i].replace(/^(.+)\{.+$/, '$1'));
						const target = trimString(targets[i].replace(/^.+\{(.+)$/, '$1'));

						if (mediaQuery === '' && target === '') {
							continue;
						}

						mediaQueriesAndTargets.push([mediaQuery, target]);
					}

					function checkMediaQuery() {
						for (let i = 0; i < mediaQueriesAndTargets.length; i++) {
							const mediaQuery = mediaQueriesAndTargets[i][0];
							const selector = mediaQueriesAndTargets[i][1];

							if (mediaQuery === '*' ||
									(typeof $window.matchMedia !== 'undefined' && $window.matchMedia(mediaQuery))) {
								same(selector, element);
							} else {
								removeSame(selector, element);
							}
						}
					}

					let resizeTimer;

					$window.addEventListener('resize', () => {
						$window.clearTimeout(resizeTimer);
						resizeTimer = $window.setTimeout(checkMediaQuery, 10);
					});
					resizeTimer = $window.setTimeout(checkMediaQuery, 10);
				}
			};
		}
	};
}]);
