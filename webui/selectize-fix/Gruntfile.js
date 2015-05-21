module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        uglify: {
            build: {
                src: "selectize.js",
                dest: "selectize.min.js"
            }
        },
        replace: {
            build: {
                src: "../vendor/selectize/dist/js/standalone/selectize.js",
                dest: "selectize.js",
                replacements: [{
                    from: 'if (!key || this.options.hasOwnProperty(key)) return false;',
                    to: 'if ((!key || this.options.hasOwnProperty(key)) && !this.settings.allowEmptyOption) return false;'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');

    // Default task.
    grunt.registerTask('default', ['replace', 'uglify']);
};
