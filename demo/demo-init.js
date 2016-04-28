startapp({
    "timeout": 60000,
    "css_callback_timeout": 300,
    "res": {
        "resources": {
            "framework": [{
                "url": ["../engine/js/framework/framework.min.js"],
                "async": true
            }],
            "core": [{
                "url": ["../engine/js/core/core.min.js"],
                "async": true
            }]
        },
        "dependencies": {
            "framework": [],
            "core": ["framework"]
        },
        "unknown": []
    },
    "translations": {},
    "locale": "en",
    "path": {
        "base": "./",
        "webui": "../webui",
        "webui_engine": "../engine"
    },
    "requirejs": {
        "paths": {
            "tinymce": "{{pathname}}/vendor/webui-tinymce/tinymce.min",
            "tinymce.jquery": "{{pathname}}/vendor/webui-tinymce/jquery.tinymce.min",
            "tinymce.helper": "{{path}}/vendor/vsymfo-tinymce-helper/tinymce.helper.min",
            "chartjs": "{{path}}/vendor/chartjs/Chart.min",
            "chartjs.type.linealt": "{{path}}/vendor/chartjs-type-linealt/chartjs-type-linealt.min",
            "highcharts": "{{path}}/vendor/highcharts-release/highcharts",
            "jquery.smooth-scroll": "{{path}}/vendor/jquery-smooth-scroll/jquery.smooth-scroll.min",
            "jquery.easing": "{{path}}/vendor/jquery.easing/js/jquery.easing.min",
            "jquery.sortable": "{{path}}/vendor/jquery-sortable/source/js/jquery-sortable-min",
            "tinysort": "{{path}}/vendor/tinysort/dist/tinysort.min",
            "bootstrap-paginator": "{{path}}/vendor/bootstrap-paginator/build/bootstrap-paginator.min",
            "select2": "{{path}}/vendor/select2/dist/js/select2.full.min"
        },        
        "shim": {
            "tinymce": {
                "exports": "tinymce"
            },
            "tinymce.jquery": ["jquery", "tinymce"],
            "highcharts": {
                "deps": ["jquery"],
                "exports": "Highcharts"
            }
        }
    },
    "cssloader": {
        "select2": "style/select2/select2"
    }
});
