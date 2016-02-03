module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        '6to5': {
            dist: {
                files: {
                    'dist/sameHeight.es5.js': 'src/sameHeight.es6.js'
                }
            }
        },

        watch: {
            js: {
                files: ['src/sameHeight.es6.js'],
                tasks: ['build',],
                options: {
                    debounceDelay: 100,
                },
            }
        },

        concat: {
            distEs5: {
                options: {
                    banner: "// This file is compiled from sameHeight.es6.js. All direct edits will be lost.\n\n"
                },
                files: {
                    'dist/sameHeight.es5.js': [
                        'node_modules/6to5/browser-polyfill.js',
                        'dist/sameHeight.es5.js',
                    ],
                }
            },
            distEs6: {
                files: {
                    'dist/sameHeight.es6.js': [
                        'src/sameHeight.es6.js',
                    ],
                }
            }
        }
    });

    grunt.registerTask('default', [
        'build',
        'watch',
    ]);

    grunt.registerTask('build', [
        '6to5',
        'concat',
    ]);
};
