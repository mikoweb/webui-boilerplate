/*globals jsloader, Modernizr*/

/**
 * To jest plik rozruchowy, który powinieneś dostosować do własnych potrzeb
 */
var startapp = function(data) {
    "use strict";

    var k, i;

    // maksymalny czas wczytywanie skryptu
    jsloader.timeout(data.timeout);
    // warunkowe wczytywanie es5-shim, jeżeli przeglądarka nie implementuje ES5
    jsloader.requirement({
        test: Modernizr.es5array && Modernizr.es5date && Modernizr.es5function && Modernizr.es5object && Modernizr.es5string,
        nope: [data.path.webui_engine + '/js/es5-shim.min.js', data.path.webui_engine + '/js/es5-sham.min.js']
    });

    /**
     * Umieść nowe zasoby js w loaderze.
     * Da są zawarte w tablicy: data.res.resources.
     * Struktura:
     * {
     *  "res": {
     *      "resources" {
     *          "group_name": [{"url": [file, ...], "async": true|false},
     *          ...
     *      },
     *      // zależności
     *      "dependencies": {"framework": [], "core": ["framework"], "module": ["core"]},
     *      // zasoby o nieokreślonej grupie
     *      "unknown": [
     *          {"url": [file, ...], "async": true|false},
     *          ...
     *      ]
     *  }
     * }
     */
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

    // co zrobić po załadowaniu skryptów frameworka
    jsloader.onLoad('framework', function () {
        jQuery.app.define("path_base", data.path.base);
        jQuery.app.define("path_webui", data.path.webui);
        jQuery.app.define("path_webui_engine", data.path.webui_engine);
        jQuery.app.trans.add(data.translations);

        // webui vendors
        require(["webgui-vendor"], function (vendor) {
            vendor(data.path.webui);
        });
    });

    // zamień żeby nikt nie użył po raz kolejny
    startapp = undefined;
};
