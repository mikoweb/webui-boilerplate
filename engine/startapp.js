/**
 * To jest plik rozruchowy, który powinieneś dostosować do własnych potrzeb
 */
function startapp (data) {
    "use strict";

    var k, i;

    // czas po, którym wczytywanie zostanie zatrzymane
    jsloader.timeout(data.timeout);
    // warunkowe wczytywanie es5-shim, jeżeli przeglądarka nie implementuje ES5
    jsloader.requirement({
        test: Modernizr.es5array && Modernizr.es5date && Modernizr.es5function && Modernizr.es5object && Modernizr.es5string,
        nope: [data.path.webui_engine + '/js/es5-shim.min.js', data.path.webui_engine + '/js/es5-sham.min.js']
    });

    for (k in data.res.resources) {
        if (data.res.resources.hasOwnProperty(k)) {
            jsloader.group(k, data.res.dependencies[k]);
            for (i = 0; i < data.res.resources[k].length; i++) {
                jsloader.add(k, data.res.resources[k][i].url, data.res.resources[k][i].async);
            }
        }
    }

    // jeżeli wykryto urządzenie dotykowe to załaduj jQuery Mobile
    if (Modernizr.touch) {
        jsloader.add("core", [data.path.webui_engine + '/js/framework/jquery.mobile.only-events.min.js'], true);
    }

    // zasoby nieznane - nieprzypisane do żadnej grupy
    for (i = 0; i < data.res.unknown.length; i++) {
        jsloader.add('', data.res.unknown[i].url, data.res.unknown[i].url.async);
    }

    jsloader.onLoad('framework', function () {
        require(['webui-vendor'], function (vendor) {
            vendor(data.path.webui, data.locale);
        });

        require(['webui-cssloader', 'webui-vendor-css'], function (loader, paths) {
            loader.timeout(data.timeout);
            loader.mode('static');
            loader.setBasePath(data.path.webui);
            loader.definePath(paths);
            if (data.css_callback_timeout !== undefined) {
                loader.setCallbackTimeout(data.css_callback_timeout);
            }
        });
    });

    jsloader.onLoad('core', function () {
        require(['jquery'], function ($) {
            $.app.define("path_base", data.path.base);
            $.app.define("path_webui", data.path.webui);
            $.app.define("path_webui_engine", data.path.webui_engine);
            $.app.trans.add(data.translations);
        });
    });

    startapp = undefined;
}
