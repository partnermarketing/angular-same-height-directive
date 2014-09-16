module.exports = function (config) {
	config.set({
		frameworks: ['jasmine'],
		files: [
			'etc/js-tests/angular-1.2.9.js',
			'etc/js-tests/angular-mocks.js',
			'src/*.js',
			'test/unit/*.js'
		],

		// Toggle these lines to have files auto watched.
		singleRun: true, autoWatch: false,
		// singleRun: false, autoWatch: true,

		browsers: ['PhantomJS'],
		reporters: ['dots', 'coverage'],

		preprocessors: {
			'src/*.js': 'coverage',
		},

		coverageReporter: {
			type : 'html',
			dir : 'build/karma-coverage/',
		}
	});
};
