module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        less: {
            build: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {"slider-style.css": "grunt/build.less"}
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task.
    grunt.registerTask('default', ['less']);
};
