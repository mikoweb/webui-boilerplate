module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "jquery/dist/jquery.js",
                    "bootstrap/dist/js/bootstrap.js",
                    "jquery-app/jquery.app.js",
                    "requirejs/require.js",
                    "../../../webui/main.js"
                ],
                dest: "framework.js"
            }
        },
        uglify: {
            build: {
                src: "framework.js",
                dest: "framework.min.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify']);
};
