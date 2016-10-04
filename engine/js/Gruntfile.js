module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "modernizr/modernizr-custom.js",
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

    grunt.registerTask('default', ['concat', 'uglify']);
};
