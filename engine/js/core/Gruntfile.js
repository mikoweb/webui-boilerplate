module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "jquery-app/jquery.app.js",
                    "jquery-sprintf/jquery.sprintf.js",
                    "init-plugins.js"
                ],
                dest: "core.js"
            }
        },
        uglify: {
            build: {
                src: "core.js",
                dest: "core.min.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify']);
};
