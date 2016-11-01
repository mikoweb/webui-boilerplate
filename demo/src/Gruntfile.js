var webuiBabel = require('webui-grunt-babel'),
    util = require('util');

module.exports = function(grunt) {
    "use strict";

    grunt.initConfig(util._extend(webuiBabel.getConfig({
        src: 'js',
        dist: '../dist',
        srcFolder: 'js',
        babelHelpers: '../babel-helpers.js'
    }), {
        pkg: grunt.file.readJSON('package.json')
    }));

    webuiBabel.registerTasks(grunt);
};
