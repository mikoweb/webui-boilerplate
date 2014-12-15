(function () {
    "use strict";

    define("jquery", [], function () {
        return jQuery;
    });

    define("bootstrap", ['jquery'], function ($) {
        return $;
    });

    define("underscore", [], function() {
        return _;
    });

    define("backbone", ['underscore', 'jquery'], function() {
        return Backbone;
    });

    var used = false;
    function vendor(path) {
        if (!used) {
            require.config({
                'paths': {
                    'tinymce':  path + '/vendor/tinymce-dist/tinymce.min',
                    'tinymce.jquery': path + '/vendor/tinymce-dist/jquery.tinymce.min',
                    'tinymce.helper': path + '/vendor/vsymfo-tinymce-helper/tinymce.helper.min',
                    'selectize': path + '/vendor/webui-selectize-js/selectize.min'
                },
                'shim': {
                    'tinymce': {
                        exports: 'tinymce'
                    },
                    'tinymce.jquery': ['jquery', 'tinymce']
                }
            });

            used = true;
        }
    }

    define("webgui-vendor", function () {
        return vendor;
    });
}());
