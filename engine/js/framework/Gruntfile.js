var depsForAll = [
    "requirejs/require.js",
    "main.js",
    "webui-cssloader/webui-cssloader.js"
];

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "jquery/dist/jquery.js",
                    "tether/dist/js/tether.js",
                    "bootstrap/dist/js/bootstrap.js",
                    "underscore/underscore.js",
                    "backbone/backbone.js"
                ].concat(depsForAll),
                dest: "framework.js"
            },
            mini: {
                src: [
                    "jquery/dist/jquery.js"
                ].concat(depsForAll),
                dest: "framework-mini.js"
            },
            marionette: {
                src: [
                    "jquery/dist/jquery.js",
                    "tether/dist/js/tether.js",
                    "bootstrap/dist/js/bootstrap.js",
                    "underscore/underscore.js",
                    "backbone/backbone.js",
                    "backbone.radio/build/backbone.radio.js",
                    "marionette/lib/backbone.marionette.js"
                ].concat(depsForAll),
                dest: "framework-marionette.js"
            },
            marionette_no_twbs: {
                src: [
                    "jquery/dist/jquery.js",
                    "underscore/underscore.js",
                    "backbone/backbone.js",
                    "backbone.radio/build/backbone.radio.js",
                    "marionette/lib/backbone.marionette.js"
                ].concat(depsForAll),
                dest: "framework-marionette-no-twbs.js"
            },
            no_twbs: {
                src: [
                    "jquery/dist/jquery.js",
                    "underscore/underscore.js",
                    "backbone/backbone.js"
                ].concat(depsForAll),
                dest: "framework-no-twbs.js"
            },
            no_bb: {
                src: [
                    "jquery/dist/jquery.js",
                    "tether/dist/js/tether.js",
                    "bootstrap/dist/js/bootstrap.js"
                ].concat(depsForAll),
                dest: "framework-no-bb.js"
            }
        },
        uglify: {
            build: {
                src: "framework.js",
                dest: "framework.min.js"
            },
            mini: {
                src: "framework-mini.js",
                dest: "framework-mini.min.js"
            },
            marionette: {
                src: "framework-marionette.js",
                dest: "framework-marionette.min.js"
            },
            marionette_no_twbs: {
                src: "framework-marionette-no-twbs.js",
                dest: "framework-marionette-no-twbs.min.js"
            },
            no_twbs: {
                src: "framework-no-twbs.js",
                dest: "framework-no-twbs.min.js"
            },
            no_bb: {
                src: "framework-no-bb.js",
                dest: "framework-no-bb.min.js"
            },
            jquery_mobile: {
                src: "jquery.mobile.only-events.js",
                dest: "jquery.mobile.only-events.min.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', [
        'concat:build', 
        'uglify:build',
        'concat:mini',
        'uglify:mini',
        'concat:marionette',
        'uglify:marionette',
        'concat:marionette_no_twbs',
        'uglify:marionette_no_twbs',
        'concat:no_twbs',
        'uglify:no_twbs',
        'concat:no_bb',
        'uglify:no_bb'
    ]);

    grunt.registerTask('jquery.mobile', ['uglify:query_mobile']);
};
