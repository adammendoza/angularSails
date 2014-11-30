/**
* Grunt automation.
*/
module.exports = function(grunt) {

    var getTime = function(){

        return new Date().getTime();

    };


    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        app: {
            src: 'src',
            lib: 'lib',
            dist: 'dist',
            vendor: 'vendor',
            tests: 'tests',
            example: 'example/assets',
            pkg: grunt.file.readJSON('bower.json')
        },

        ngdocs: {
            options: {
                dest: 'docs',
                //scripts: ['../.min.js'],
                html5Mode: false,
                startPage: '/api',
                title: "angularSails 0.10.1",
            //    image: "assets/images/angularSailsLogoSmall.png",
            //    navTemplate: "assets/templates/navTemplate.html",
                imageLink: "/api",
                titleLink: "/api",
                bestMatch: true,
                analytics: {
                    account: 'UA-53843607-2',
                    domainName: 'ngsails.herokuapp.com'
                }
            },
            tutorial: {
                src: ['content/tutorial/*.ngdoc'],
                title: 'Tutorial'
            },
            api: {
                src: ['dist/angularSails.js'],
                title: 'API Documentation'
            }
        },

        concat: {
            sails: {
                src: ['<%= app.lib %>/socket.io.min.js','<%= app.src %>/angularSails.js','<%= app.src %>/*.js','<%= app.src %>/utils.js'],
                dest: '<%= app.dist %>/angularSails.js'
            }


        },

        copy: {
            example: {
                src: ['<%= app.lib %>/*.js','<%= app.dist %>/*.js',],
                dest: '<%= app.example %>/js/',
                flatten : true,
                expand : true
            },
            vendor: {
                src: ['<%= app.vendor %>/**/*.js','<%= app.vendor %>/**/*.js'],
                dest: '<%= app.example %>/js/',
                flatten : true,
                expand : false
            }
        },

        uglify: {
            options: {
                sourceMap: true,
                banner: '/*\n'
                + '  <%= app.pkg.name %> <%= app.pkg.version %>-build' + getTime() + '\n'
                + '  Built with <3 by Balderdashy'
                + '*/'
            },
            dist: {
                files: {
                    '<%= app.dist %>/<%= app.pkg.name %>.min.js': ['<%= app.dist %>/<%= app.pkg.name %>.js']
                }
            }
        },

        jshint: {

            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },

            all: [
            '<%= app.src %>/**/*.js',
            '<%= app.tests %>/**/*.spec.js'
            ]
        },

        watch: {
            source: {
                files: ['<%= app.src %>/**/*.js'],
                tasks: ['concat:sails','ngdocs:all','copy:example'],
                options: {
                    debounceDelay: 500,
                    atBegin: true
                }
            },
            tests: {
                files: ['<%= app.tests %>/**/*.spec.js'],
                tasks: ['newer:jshint', 'karma:precompile'],
                options: {
                    debounceDelay: 500,
                    atBegin: true
                }
            }
        },

        karma: {
            precompile: {
                configFile: 'karma.conf.js'
            },
            postcompile: {
                configFile: 'karma.postcompile.conf.js',
            }
        },

        ngAnnotate: {
            options: {
                add: true
                // Task-specific options go here.
            },
            src: {
                files: [{
                    src: ['<%= app.src %>/**/*.js'],
                }]
                // Target-specific file lists and/or options go here.
            }
        },

    });

    grunt.loadNpmTasks('grunt-ngdocs-bs3');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ng-annotate');

    // Registered tasks.
    grunt.registerTask('default', ['concat:sails','copy:example']);

    grunt.registerTask('docs', ['ngdocs']);

    //
    //  grunt.registerTask('dev', ['watch']);
    //
    grunt.registerTask('test', ['karma:precompile']);
    //
    grunt.registerTask('build', [
    //    'jshint',
    'karma:precompile',
    'concat:sails',
    'uglify',
    'copy',
    'karma:postcompile'
    ]);
};
