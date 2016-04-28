(function () {
    "use strict";

    define('jquery', [], function () {
        return jQuery;
    });

    define('bootstrap', ['jquery'], function ($) {
        return $;
    });

    if (typeof _ !== 'undefined') {
        define('underscore', [], function() {
            return _;
        });
    }

    if (typeof Backbone !== 'undefined') {
        define('backbone', ['underscore', 'jquery'], function() {
            return Backbone;
        });
    }

    if (typeof Marionette !== 'undefined') {
        define('marionette', ['backbone'], function() {
            return Marionette;
        });
    }

    var used = false, vendorCss;
    function vendor(path, locale) {
        if (!used) {
            var pathPart = document.createElement('a');
            pathPart.href= path;
            locale = locale || 'en';

            require.config({
                'paths': {
                    'tinymce':  pathPart.pathname + '/vendor/webui-tinymce/tinymce.min',
                    'tinymce.jquery': pathPart.pathname + '/vendor/webui-tinymce/jquery.tinymce.min',
                    'tinymce.helper': path + '/vendor/vsymfo-tinymce-helper/tinymce.helper.min',
                    'chartjs': path + '/vendor/chartjs/Chart.min',
                    'chartjs.type.linealt': path + '/vendor/chartjs-type-linealt/chartjs-type-linealt.min',
                    'highcharts': path + '/vendor/highcharts-release/highcharts',
                    'jquery.smooth-scroll': path + '/vendor/jquery-smooth-scroll/jquery.smooth-scroll.min',
                    'jquery.easing': path + '/vendor/jquery.easing/js/jquery.easing.min',
                    'jquery.sortable': path + '/vendor/jquery-sortable/source/js/jquery-sortable-min',
                    'tinysort': path + '/vendor/tinysort/dist/tinysort.min',
                    'bootstrap-paginator': path + '/vendor/bootstrap-paginator/build/bootstrap-paginator.min',
                    'select2': path + '/vendor/select2/dist/js/select2.full.min'
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
        'select2': 'style/select2/select2'
    };

    define('webui-vendor-css', function () {
        return vendorCss;
    });
}());
