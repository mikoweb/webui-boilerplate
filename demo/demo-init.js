(function (basePath) {
    "use strict";
    startapp({
        timeout: 60000,
        requirejs: {
            baseUrl: basePath + 'dist',
            "paths": {
                "jquery.sortable": "{{path}}/jquery-sortable/jquery-sortable",
                "chartjs": "{{path}}/chart.js/chart",
                "tinysort": "{{path}}/tinysort/tinysort",
                "nunjucks": "{{path}}/nunjucks/nunjucks",
                "select2": "{{path}}/select2/select2",
                "highcharts": "{{path}}/highcharts/highcharts",
                "text": "{{path}}/requirejs-text/requirejs-text"
            },
            shim: {
                'nunjucks' : {
                    exports: 'nunjucks'
                },
                'highcharts': {
                    deps: ['jquery'],
                    exports: 'Highcharts'
                }
            }
        },
        cssloader: {
            'select2': 'style/select2/select2'
        },
        res: {
            resources: {
                framework: [{
                    url: [
                        'webui/engine/js/framework/framework-marionette.min.js',
                        'babel-helpers.js'
                    ],
                    async: true
                }],
                core: [{
                    url: ['webui/engine/js/core/core.min.js'],
                    async: true
                }]
            },
            dependencies: {
                framework: [],
                core: ['framework']
            }
        },
        translations: {},
        locale: 'en',
        path: {
            base: basePath,
            lib: basePath + '../lib',
            webui: basePath + 'webui/webui',
            webui_engine: basePath + 'webui/engine',
            'public': basePath + 'webui'
        }
    });
}('./'));
