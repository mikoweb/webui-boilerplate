/*
 * This file is part of the WebUI
 *
 * website: www.vision-web.pl
 * (c) Rafał Mikołajun <rafal@vision-web.pl>
 */

/**
 * Loader arkuszy stylów dla WebUI
 * @author Rafał Mikołajun <rafal@vision-web.pl>
 * @package WebUI
 * @copyright 2014 Rafał Mikołajun
 * @license GPL v2
 */

(function () {
    "use strict";

    var timeout = 5000, module, injected = {}, injectMode = 'static',
        basePath = '.', patterPath = './{package-name}';

    /**
     * Limit czasu wczytywania arkusza
     * @param {int} time
     */
    function setTimeout(time) {
        timeout = time;
    }

    /**
     * Ładowanie arkusza
     * @param {string} filename
     */
    function inject(filename) {
        var path;

        switch (injectMode) {
            case 'dynamic':
                path = patterPath.replace("{package-name}", encodeURIComponent(filename.replace("/", "|")));
                break;
            case 'static':
            default:
                path = basePath + '/' + filename + '.css';
        }

        if (injected[path] === undefined) {
            injected[path] = true;
            yepnope.injectCss(path, null, null, timeout);
        }
    }

    /**
     * Tryb ładowania. Różni się sposobem generowania ścieżek.
     * @param {string} mode
     */
    function setInjectMode(mode) {
        if (mode === 'dynamic' || mode === 'static') {
            injectMode = mode;
        } else {
            throw new Error('unknown inject mode');
        }
    }

    /**
     * Ustaw ścieżkę bazową.
     * Ustawienie dla trybu static.
     * @param {string} path
     */
    function setBasePath(path) {
        if (typeof path !== 'string') {
            throw new Error('path is not string');
        }

        basePath = path;
    }

    /**
     * Ustaw wzorzec ścieżki.
     * Wzorzec musi zawierać łańcuch {package-name}.
     * Ustawienie dla trybu dynamic.
     * @param {string} pattern
     */
    function setPatterPath(pattern) {
        if (typeof pattern !== 'string') {
            throw new Error('pattern is not string');
        }

        if (pattern.indexOf("{package-name}") === -1) {
            throw new Error('pattern does not contain a chain: {package-name}');
        }

        patterPath = pattern;
    }

    module = {
        timeout: setTimeout,
        inject: inject,
        mode: setInjectMode,
        setBasePath: setBasePath,
        setPatterPath: setPatterPath
    };

    define("webui-cssloader", function () {
        return module;
    });
}());
