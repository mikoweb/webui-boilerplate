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
                    'tinymce':  path + '/tinymce/tinymce.min',
                    'tinymce.jquery': path + '/tinymce/jquery.tinymce.min',
                    'tinymce.helper': path + '/vendor/vsymfo-tinymce-helper/tinymce.helper.min',
                    'selectize': path + '/vendor/webui-selectize-js/selectize.min',
                    'chartjs': path + '/vendor/chartjs/Chart.min',
                    'chartjs.type.linealt': path + '/vendor/chartjs-type-linealt/chartjs-type-linealt.min',
                    'highcharts': path + '/vendor/highcharts-release/highcharts',
                    'jquery.smooth-scroll': path + '/vendor/jquery-smooth-scroll/jquery.smooth-scroll.min',
                    'jquery.easing': path + '/vendor/jquery.easing/js/jquery.easing.min',
                    'jquery.themepunch.tools': path + '/slider-revolution4/js/jquery.themepunch.tools.min',
                    'jquery.themepunch.revolution': path + '/slider-revolution4/js/jquery.themepunch.revolution.min'
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
        'selectize': 'vendor/webui-selectize-js/selectize',
        'jquery.themepunch.revolution': 'slider-revolution4/slider-style'
    };

    define("webui-vendor-css", function () {
        return vendorCss;
    });
}());
