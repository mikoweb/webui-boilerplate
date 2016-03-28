module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    // https://github.com/mikoweb/jquery-sprintf
                    "jquery-sprintf/jquery.sprintf.js",
                    // HTML5 polyfills
                    // http://ericleads.com/h5validate/
                    "jquery.h5validate.js",
                    // https://github.com/mathiasbynens/jquery-placeholder
                    "jquery-placeholder/jquery.placeholder.js",
                    // https://github.com/mathiasbynens/jquery-details
                    "jquery-details/jquery.details.js",
                    // Inicjalizacja pluginów
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
