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
                tasks: ['6to5', 'concat',],
                options: {
                    debounceDelay: 100,
                },
            }
        },

        concat: {
            options: {
                banner: "// This file is compiled from sameHeight.es6.js. All direct edits will be lost.\n\n"
            },
            dist: {
                files: {
                    'src/sameHeight.es5.js': [
                        'node_modules/6to5/browser-polyfill.js',
                        'src/sameHeight.es5.js',
                    ]
                }
            }
        }
    });

    grunt.registerTask('default', [
        '6to5',
        'concat',
        'watch',
    ]);
};
