(function () {
    "use strict";

    var used = false;
    function vendor(path) {
        if (!used) {
            require.config({
                'paths': {
                    'tinymce.jquery': path + '/vendor/tinymce-dist/tinymce.jquery.min.js'
                },
                'shim': {
                    'tinymce.jquery': ['jquery']
                }
            });

            define("jquery", function () {
                return jQuery;
            });

            define("bootstrap", ['jquery'], function ($) {
                return $;
            });

            used = true;
        }
    }

    define("webgui-vendor", function () {
        return vendor;
    });
}());
