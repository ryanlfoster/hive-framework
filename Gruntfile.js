module.exports = function (grunt)
{
    'use strict';

    // Load Grunt plugins.
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Use 'config.rb' file to configure Compass.
        compass: {
            dev: {
                options: {
                    config: 'config.rb',
                    force: true
                }
            }
        },

        // Gzip compress the theme files.
        compress: {
            dist: {
                options: {
                    mode: 'gzip'
                },
                files: [
                    {expand: true, src: ['public/assets/**/*.js'], ext: '.js.gz'},
                    {expand: true, src: ['public/assets/**/*.min.js'], ext: '.min.js.gz'},
                    {expand: true, src: ['public/assets/**/*.css'], ext: '.css.gz'},
                    {expand: true, src: ['public/assets/**/*.svg'], ext: '.svg.gz'}
                ]
            }
        },

        copy: {
            // Copy files from `src/` to `public/`.
            js: {
                files: [
                    {expand: true, cwd: 'src/', src: ['*'], dest: 'public/', filter: 'isFile'},
                    {expand: true, cwd: 'src/assets/js/libs/', src: ['**'], dest: 'public/assets/js/'},
                    // Also, Selectivizr breaks Uglify, so just copy it as-is.
                    {src: 'bower_components/selectivizr/selectivizr.js', dest: 'public/assets/js/selectivizr.js'}
                ]
            },

            // Copy Flowplayer images to CSS folder (because Flowplayer's CSS expects relative path of `img/`).
            css: {
                files: [
                    {expand: true, cwd: 'src/assets/js/libs/flowplayer/skin/img/', src: ['**'], dest: 'public/assets/css/img/'}
                ]
            }
        },

        // Concatenate, minify and copy CSS files to `public/assets/css/`.
        cssmin: {
            main: {
                files: {
                    'public/assets/css/main.css': [
                        'tmp/assets/css/style.css',
                        'tmp/assets/css/jquery-ui.css',
                        'src/assets/js/libs/flowplayer/skin/minimalist.css'
                    ],
                    'public/assets/css/ie8.css': ['tmp/assets/css/ie8.css']
                }
            }
        },

        // Check code quality of Gruntfile.js and site-specific JavaScript using JSHint.
        jshint: {
            files: ['Gruntfile.js', 'src/assets/js/*.js'],
            options: {
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                es3: true,
                forin: true,
                immed: true,
                indent: 4,
                latedef: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: 'single',
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                browser: true,
                globals: {
                    jQuery: true,
                    Zepto: true,
                    define: true,
                    module: true,
                    require: true,
                    requirejs: true,
                    responsiveNav: true,
                    prettyPrint: true
                }
            }
        },

        // Uglify and copy JavaScript files from `bower-components`, and also `main.js`, to `public/assets/js/`.
        uglify: {
            dist: {
                // Preserve all comments that start with a bang (!) or include a closure compiler style.
                options: {
                    preserveComments: 'some'
                },

                files: [
                    {
                        'public/assets/js/main.js': ['src/assets/js/main.js'],
                        'public/assets/js/autosize.js': ['bower_components/jquery-autosize/jquery.autosize.js'],
                        'public/assets/js/cookie.js': ['bower_components/jquery.cookie/jquery.cookie.js'],
                        'public/assets/js/details.js': ['bower_components/jquery-details/jquery.details.js'],
                        'public/assets/js/html5shiv.js': ['bower_components/html5shiv/dist/html5shiv.js'],
                        'public/assets/js/iscroll.js': ['bower_components/iscroll/build/iscroll-lite.js'],
                        'public/assets/js/picturefill.js': ['bower_components/picturefill/dist/picturefill.min.js'],
                        'public/assets/js/placeholder.js': ['bower_components/jquery-placeholder/jquery.placeholder.js'],
                        'public/assets/js/prettify.js': ['bower_components/google-code-prettify/src/prettify.js'],
                        'public/assets/js/require.js': ['bower_components/requirejs/require.js'],
                        'public/assets/js/responsivenav.js': ['bower_components/responsive-nav/responsive-nav.js'],
                        'public/assets/js/responsiveslides.js': ['bower_components/ResponsiveSlides.js/responsiveslides.js'],
                        'public/assets/js/stellar.js': ['bower_components/jquery.stellar/jquery.stellar.js']
                    },
                    {
                        expand: true,
                        cwd: 'bower_components/google-code-prettify/src/',
                        src: 'lang-*.js',
                        dest: 'public/assets/js/'
                    }
                ]
            }
        },

        // Directories watched and tasks performed by invoking `grunt watch`.
        watch: {
            sass: {
                files: 'src/assets/sass/**',
                tasks: ['sass']
            },

            js: {
                files: 'src/assets/js/*.js',
                tasks: ['jshint', 'copy', 'uglify']
            }
        }

    });

    // Register tasks.
    grunt.registerTask('build', ['jshint', 'sass', 'copy:js', 'uglify', 'compress']);
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('sass', ['compass', 'cssmin', 'copy:css']);
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('travis', ['jshint', 'compass']);
};
