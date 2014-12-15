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
                    // http://selectivizr.com/
                    "selectivizr/selectivizr.js",
                    // https://github.com/mathiasbynens/jquery-details
                    "jquery-details/jquery.details.js",

                    // jQuery Hash Router:
                    // https://github.com/mikoweb/jQuery_Hash_Router
                    // wyłączamy to, gdyż backbone implementuje lepszy routing ale zostawiamy hashchange polyfill
                    "jquery-hash-router/jquery.hashchange.js",
                    //"jquery-hash-router/jquery.hash-router.js",
                    //"jquery-hash-router/jquery.hash-router-ajax-response.js",

                    // Bootstrap Paginator
                    // https://github.com/lyonlai/bootstrap-paginator
                    "bootstrap-paginator/build/bootstrap-paginator.min.js",

                    // Bootstrap hover dropdown menu
                    // https://github.com/CWSpear/bootstrap-hover-dropdown
                    "bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js",

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
