module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        sass: {
            bootstrap: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    '../css/bootstrap.min.css': 'bootstrap.scss'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('bootstrap', [
        'sass:bootstrap'
    ]);
};
