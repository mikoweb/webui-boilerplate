(function (basePath) {
    "use strict";

    startapp({
        timeout: 60000,
        res: {
            resources: {
                framework: [{
                    url: [
                        '../engine/js/framework/framework-marionette.min.js',
                        'babel-helpers.js'
                    ],
                    async: true
                }],
                core: [{
                    url: ['../engine/js/core/core.min.js'],
                    async: true
                }]
            },
            dependencies: {
                framework: [],
                core: ['framework']
            },
            unknown: []
        },
        translations: {},
        locale: 'en',
        path: {
            base: basePath,
            webui: basePath + 'webui',
            webui_engine: basePath + 'engine',
            'public': basePath + 'public'
        },
        requirejs: {
            baseUrl: basePath + 'demo/dist',
            paths: {
                'text': '{{path}}/vendor/requirejs-text/text',
                'nunjucks': '{{path}}/vendor/nunjucks/browser/nunjucks.min',
                'tinymce': '{{pathname}}/vendor/webui-tinymce/tinymce.min',
                'tinymce.jquery': '{{pathname}}/vendor/webui-tinymce/jquery.tinymce.min',
                'tinymce.helper': '{{path}}/vendor/webui-tinymce-helper/tinymce.helper.min',
                'chartjs': '{{path}}/vendor/chartjs/Chart.min',
                'chartjs.type.linealt': '{{path}}/vendor/chartjs-type-linealt/chartjs-type-linealt.min',
                'highcharts': '{{path}}/vendor/highcharts-release/highcharts',
                'jquery.smooth-scroll': '{{path}}/vendor/jquery-smooth-scroll/jquery.smooth-scroll.min',
                'jquery.easing': '{{path}}/vendor/jquery.easing/js/jquery.easing.min',
                'jquery.sortable': '{{path}}/vendor/jquery-sortable/source/js/jquery-sortable-min',
                'tinysort': '{{path}}/vendor/tinysort/dist/tinysort.min',
                'bootstrap-paginator': '{{path}}/vendor/bootstrap-paginator/build/bootstrap-paginator.min',
                'select2': '{{path}}/vendor/select2/dist/js/select2.full.min'
            },
            shim: {
                'nunjucks' : {
                    exports: 'nunjucks'
                },
                'tinymce': {
                    exports: 'tinymce'
                },
                'tinymce.jquery': ['jquery', 'tinymce'],
                'highcharts': {
                    deps: ['jquery'],
                    exports: 'Highcharts'
                }
            }
        },
        cssloader: {
            'select2': 'style/select2/select2'
        }
    });
}('/WebUI/'));
