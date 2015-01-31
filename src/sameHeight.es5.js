"use strict";

var _toArray = function (arr) { return Array.isArray(arr) ? arr : Array.from(arr); };

angular.module("partnermarketing.sameHeight", []);

angular.module("partnermarketing.sameHeight").directive("sameHeight", function ($window) {
	"use strict";

	function same(selector, element) {
		// Ensure we aren't calculating based on any previously forced heights.
		removeSame(selector, element);

		var greatestHeight = 0;

		var elements = findTargetElements(selector, element);

		for (var i = 0; i < elements.length; i++) {
			if (elements[i].innerHeight > greatestHeight) {
				greatestHeight = elements[i].innerHeight;
			}
		}

		elements.map(function (element) {
			return element.style.height = String(greatestHeight) + "px";
		});
	}

	function removeSame(selector, element) {
		var elements = findTargetElements(selector, element);
		for (var i = 0; i < elements.length; i++) {
			elements[i].style.height = "auto";
		}
	}

	var trimString = function (string) {
		return string.replace(/^ +/, "").replace(/ +$/, "");
	};

	var findTargetElements = function (selector, element) {
		return Array.apply(undefined, _toArray(element[0].querySelectorAll(selector))).filter(function (el) {
			return !isHidden(el);
		});
	};

	function isHidden(element) {
		// `offsetParent_` is used by unit tests because `offsetParent` is read-only.
		if (element.hasOwnProperty("offsetParent_")) {
			return element.offsetParent_ === null;
		} else {
			return element.offsetParent === null;
		}
	}

	return {
		restrict: "A",
		scope: {
			sameHeight: "@"
		},
		compile: function compile() {
			return {
				post: function postLink(scope, element) {
					if (!angular.isString(scope.sameHeight)) {
						return;
					}
					var targets = scope.sameHeight.split("}");
					if (targets.length < 2) {
						return;
					}

					var mediaQueriesAndTargets = [];
					for (var i = 0; i < targets.length; i++) {
						var mediaQuery = trimString(targets[i].replace(/^(.+)\{.+$/, "$1"));
						var target = trimString(targets[i].replace(/^.+\{(.+)$/, "$1"));

						if (mediaQuery === "" && target === "") {
							continue;
						}

						mediaQueriesAndTargets.push([mediaQuery, target]);
					}

					function checkMediaQuery() {
						for (var i = 0; i < mediaQueriesAndTargets.length; i++) {
							var mediaQuery = mediaQueriesAndTargets[i][0];
							var selector = mediaQueriesAndTargets[i][1];

							if (mediaQuery === "*" || typeof $window.matchMedia !== "undefined" && $window.matchMedia(mediaQuery)) {
								same(selector, element);
							} else {
								removeSame(selector, element);
							}
						}
					}

					var resizeTimer;

					$window.addEventListener("resize", function () {
						$window.clearTimeout(resizeTimer);
						resizeTimer = $window.setTimeout(checkMediaQuery, 10);
					});
					resizeTimer = $window.setTimeout(checkMediaQuery, 10);
				}
			};
		}
	};
});