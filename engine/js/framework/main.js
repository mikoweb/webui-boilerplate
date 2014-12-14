(function () {
    "use strict";

    var used = false;
    function vendor(path) {
        if (!used) {
            define("jquery", function () {
                return jQuery;
            });

            define("bootstrap", ['jquery'], function ($) {
                return $;
            });

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
