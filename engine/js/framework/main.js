(function () {
    "use strict";

    define('jquery', [], function () {
        return jQuery;
    });

    define('bootstrap', ['jquery'], function ($) {
        return $;
    });

    if (_) {
        define('underscore', [], function() {
            return _;
        });
    }

    if (Backbone) {
        define('backbone', ['underscore', 'jquery'], function() {
            return Backbone;
        });
    }

    if (Marionette) {
        define('marionette', ['backbone'], function() {
            return Marionette;
        });
    }

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
                    'selectize': path + '/selectize-fix/selectize.min',
                    'chartjs': path + '/vendor/chartjs/Chart.min',
                    'chartjs.type.linealt': path + '/vendor/chartjs-type-linealt/chartjs-type-linealt.min',
                    'highcharts': path + '/vendor/highcharts-release/highcharts',
                    'jquery.smooth-scroll': path + '/vendor/jquery-smooth-scroll/jquery.smooth-scroll.min',
                    'jquery.easing': path + '/vendor/jquery.easing/js/jquery.easing.min',
                    'jquery.sortable': path + '/vendor/jquery-sortable/source/js/jquery-sortable-min',
                    'tinysort': path + '/vendor/tinysort/dist/tinysort.min',
                    'bootstrap-paginator': path + '/vendor/bootstrap-paginator/build/bootstrap-paginator.min',
                    'bootstrap-hover-dropdown': path + '/vendor/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min'
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

    define('webui-vendor', function () {
        return vendor;
    });

    vendorCss = {
        'selectize': 'style/selectize/selectize'
    };

    define('webui-vendor-css', function () {
        return vendorCss;
    });
}());
