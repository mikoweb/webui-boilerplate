module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "jquery/dist/jquery.js",
                    "bootstrap/dist/js/bootstrap.js",
                    "underscore/underscore.js",
                    "backbone/backbone.js",
                    // requirejs w tym miejscu bo powyższe biblioteki mają się zadeklarować globalnie
                    // powyższe biblioteki będą zdefiniowane jako moduły w main.js
                    "requirejs/require.js",
                    "main.js",
                    // od tego miejsca można używać define
                    "jquery-app/jquery.app.js",
                    "../core/webui-cssloader/webui-cssloader.js"
                ],
                dest: "framework.js"
            }
        },
        uglify: {
            build: {
                src: "framework.js",
                dest: "framework.min.js"
            },
            jquery_mobile: {
                src: "jquery.mobile.only-events.js",
                dest: "jquery.mobile.only-events.min.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify']);
};
