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
        basePath = '.', patternPath = './{package-name}', definitions = {},
        callbackTimeout = 0;

    /**
     * Maksymalny czas wczytywania arkusza
     * @param {int} time
     */
    function setLoadTimeout(time) {
        timeout = time;
    }

    /**
     * Opóźnienie wykonywania callbacka po wczytyaniu arkusza
     * @param {int} time
     */
    function setCallbackTimeout(time) {
        callbackTimeout = time;
    }

    /**
     * Pobieranie ścieżki do pliku css
     * @param {string} prop
     * @returns {string|undefined}
     */
    function getPath(prop) {
        return definitions[prop];
    }

    /**
     * Definiowanie ścieżek do plików css
     * @param {Object} def
     */
    function definePath(def) {
        var prop;

        if (typeof def === 'object') {
            for (prop in def) {
                if(def.hasOwnProperty(prop)) {
                    if (typeof def[prop] !== 'string') {
                        throw new Error('definition value is not string');
                    }

                    definitions[prop] = def[prop];
                }
            }
        }
    }

    /**
     * Ładowanie arkusza
     * @param {string} filename
     * @param {Function} [callback]
     * @param {Object} [elemAttributes]
     * @param {int} [callTimeout]
     */
    function inject(filename, callback, elemAttributes, callTimeout) {
        var path, ctimeout;

        if (callTimeout) {
            ctimeout = callTimeout;
        } else {
            ctimeout = callbackTimeout;
        }

        if (filename.charAt(0) === '@' && getPath(filename.substring(1)) !== undefined) {
            filename = getPath(filename.substring(1));
        }

        switch (injectMode) {
            case 'dynamic':
                path = patternPath.replace("{package-name}", encodeURIComponent(filename).replace(/%2F/g, "|"));
                break;
            case 'static':
            default:
                path = basePath + '/' + filename + '.css';
        }

        if (injected[path] === undefined) {
            injected[path] = true;

            if (callback) {
                yepnope.injectCss(path, function () {
                    if (ctimeout > 0) {
                        setTimeout(callback, ctimeout);
                    } else {
                        yepnope.injectCss(path, callback, elemAttributes, timeout);
                    }
                }, elemAttributes, timeout);
            } else {
                yepnope.injectCss(path, null, elemAttributes, timeout);
            }
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
    function setPatternPath(pattern) {
        if (typeof pattern !== 'string') {
            throw new Error('pattern is not string');
        }

        pattern = decodeURIComponent(pattern);
        if (pattern.indexOf("{package-name}") === -1) {
            throw new Error('pattern does not contain a chain: {package-name}');
        }

        patternPath = pattern;
    }

    module = {
        timeout: setLoadTimeout,
        inject: inject,
        mode: setInjectMode,
        setBasePath: setBasePath,
        setPatternPath: setPatternPath,
        definePath: definePath,
        setCallbackTimeout: setCallbackTimeout
    };

    define("webui-cssloader", function () {
        return module;
    });
}());
