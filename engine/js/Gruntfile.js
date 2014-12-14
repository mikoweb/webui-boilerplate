module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "modernizr/modernizr.custom.js",
                    "modernizr/modernizr.es5.js",
                    "modernizr/isarray.js",
                    "modernizr/yepnope.js",
                    "core/jsloader/jsloader.js",
                    "../startapp.js"
                ],
                dest: "loader.js"
            }
        },
        uglify: {
            build: {
                src: "loader.js",
                dest: "loader.min.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify']);
};
