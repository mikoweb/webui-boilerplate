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
            var pathPart = document.createElement('a');
            pathPart.href= path;

            /*
             * Informacja!
             * W przypadku tinyMCE konieczne są ściezki bez domeny, ponieważ mogą wystąpić problemy z
             * dostępem do obiektu parent.tinymce w elementach iframe, które stanowią okna modalne np.
             * podczas używania pluginu codemirror. Problem występuje, gdy włączone są serwery CDN - wtedy
             * w adresie URL występuje inna nazwa domeny niż domena główna i otrzymujemy błąd:
             * Error: Permission denied to access property "tinymce"1 source.html.
             */
            require.config({
                'paths': {
                    'tinymce':  pathPart.pathname + '/tinymce/tinymce.min',
                    'tinymce.jquery': pathPart.pathname + '/tinymce/jquery.tinymce.min',
                    'tinymce.helper': path + '/vendor/vsymfo-tinymce-helper/tinymce.helper.min',
                    'selectize': path + '/vendor/webui-selectize-js/selectize.min',
                    'chartjs': path + '/vendor/chartjs/Chart.min',
                    'chartjs.type.linealt': path + '/vendor/chartjs-type-linealt/chartjs-type-linealt.min',
                    'highcharts': path + '/vendor/highcharts-release/highcharts',
                    'jquery.smooth-scroll': path + '/vendor/jquery-smooth-scroll/jquery.smooth-scroll.min',
                    'jquery.easing': path + '/vendor/jquery.easing/js/jquery.easing.min',
                    'jquery.themepunch.tools': path + '/slider-revolution4/js/jquery.themepunch.tools.min',
                    'jquery.themepunch.revolution': path + '/slider-revolution4/js/jquery.themepunch.revolution.min',
                    'jquery.sortable': path + '/vendor/jquery-sortable/source/js/jquery-sortable-min'
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
