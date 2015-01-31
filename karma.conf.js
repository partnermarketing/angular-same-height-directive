module.exports = function (config) {
	config.set({
		frameworks: ['jasmine'],
		files: [
			'etc/js-tests/angular-1.2.9.js',
			'etc/js-tests/angular-mocks.js',
			'node_modules/6to5/browser-polyfill.js',
			'src/sameHeight.es5.js',
			'test/unit/*.js'
		],

		// Toggle these lines to have files auto watched.
		singleRun: true, autoWatch: false,
		// singleRun: false, autoWatch: true,

		browsers: ['PhantomJS'],
		reporters: ['dots', 'coverage'],

		preprocessors: {
			'src/sameHeight.es5.js': 'coverage',
		},

		coverageReporter: {
			type : 'html',
			dir : 'build/karma-coverage/',
		}
	});
};
