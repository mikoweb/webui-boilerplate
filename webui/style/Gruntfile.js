module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        sass: {
            select2: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'select2/select2.css': 'select2/build.scss'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', [
        'sass:select2'
    ]);
};
