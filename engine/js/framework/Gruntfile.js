module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "requirejs/require.js",
                    "main.js",
                    "../core/webui-cssloader/webui-cssloader.js",
                    "jquery/dist/jquery.js",
                    "bootstrap/dist/js/bootstrap.js",
                    "jquery-app/jquery.app.js"
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
