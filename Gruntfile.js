module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        '6to5': {
            dist: {
                files: {
                    'src/sameHeight.es5.js': 'src/sameHeight.es6.js'
                }
            }
        },

        watch: {
            js: {
                files: ['src/sameHeight.es6.js'],
                tasks: ['6to5'],
                options: {
                    debounceDelay: 100,
                },
            }
        }
    });

    grunt.registerTask('default', [
        '6to5',
        'watch',
    ]);
};
