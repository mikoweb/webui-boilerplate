module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: {
            build: {
                src: "chartjs-type-linealt.js",
                dest: "chartjs-type-linealt.min.js"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task.
    grunt.registerTask('default', ['uglify']);
};
