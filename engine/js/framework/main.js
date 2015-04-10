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

    var used = false, vendorCss;
    function vendor(path) {
        if (!used) {
            require.config({
                'paths': {
                    'tinymce':  path + '/vendor/tinymce-dist/tinymce.min',
                    'tinymce.jquery': path + '/vendor/tinymce-dist/jquery.tinymce.min',
                    'tinymce.helper': path + '/vendor/vsymfo-tinymce-helper/tinymce.helper.min',
                    'selectize': path + '/vendor/webui-selectize-js/selectize.min',
                    'chartjs': path + '/vendor/chartjs/Chart.min',
                    'chartjs.type.linealt': path + '/vendor/chartjs-type-linealt/chartjs-type-linealt.min',
                    'highcharts': path + '/vendor/highcharts-release/highcharts',
                    'jquery.smooth-scroll': path + '/vendor/jquery-smooth-scroll/jquery.smooth-scroll.min'
                },
                'shim': {
                    'tinymce': {
                        exports: 'tinymce'
                    },
                    'tinymce.jquery': ['jquery', 'tinymce'],
                    'highcharts': {
                        deps: ['jquery'],
                        exports: 'Highcharts'
                    }
                }
            });

            used = true;
        }
    }

    define("webui-vendor", function () {
        return vendor;
    });

    vendorCss = {
        'selectize': 'vendor/webui-selectize-js/selectize'
    };

    define("webui-vendor-css", function () {
        return vendorCss;
    });
}());
