module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        concat: {
            build: {
                src: [
                    "vendor/selectize/dist/js/standalone/selectize.js",
                    "src/js/inject-css.js"
                ],
                dest: "selectize.js"
            }
        },
        uglify: {
            build: {
                src: "selectize.js",
                dest: "selectize.min.js"
            }
        },
        less: {
            build: {
                options: {
                    compress: true,
                    yuicompress: true,
                    optimization: 2
                },
                files: {"selectize.css": "src/less/build.less"}
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task.
    grunt.registerTask('default', ['concat', 'uglify', 'less']);
};
