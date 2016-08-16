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
 * @license LGPLv3
 */

(function () {
    "use strict";

    var module, injected = {}, injectMode = 'static', domainPath = '',
        basePath = '.', patternPath = './{package-name}', definitions = {},
        head = document.getElementsByTagName('head')[0], callbackTimeout = 0;

    /**
     * Opóźnienie wykonywania callbacka po wczytyaniu arkusza.
     * Ta opcja jest używana tylko wtedy gdy nie działa onLoad dla arkuszy.
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
     * Ustaw domenę
     * @param path
     */
    function setDomainPath(path) {
        if (typeof path !== 'string') {
            throw new Error('path is not string');
        }

        domainPath = path;
    }

    /**
     * Ścieżka domeny
     * @returns {string}
     */
    function getDomainPath() {
        return domainPath;
    }

    /**
     * Załóżmy, że jak przeglądarka nie ma canvas to nie jest przeglądarką nowej generacji
     * @returns {boolean}
     */
    function browserTest() {
        return !!document.createElement('canvas').getContext;
    }

    /**
     * Ustaw zdarzenie onLoad dla arkusza stylów o podanym atrybucie href
     * @param {string} href
     * @param {Function} callback
     * @param {Object} [elemAttributes]
     * @param {int} [timeout]
     */
    function styleSheetCreate(href, callback, elemAttributes, timeout) {
        var link = document.createElement('link'), prop, called = false, cssnum, ti;

        timeout = timeout || 0;

        if (typeof elemAttributes !== "object") {
            elemAttributes = {};
        }

        link.setAttribute("href", href);
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("type", "text/css");

        for (prop in elemAttributes) {
            if (elemAttributes.hasOwnProperty(prop)) {
                link.setAttribute(prop, elemAttributes[prop]);
            }
        }

        /**
         * Zdarzenie ma się wykonać tylko raz
         */
        function call() {
            if (!called) {
                callback();
                called = true;
            }
        }

        // tutaj będzie trochę kombinacji, chcę mieć pewność, że zadziała w róznych przeglądarkach
        // więcej info na http://www.phpied.com/when-is-a-stylesheet-really-loaded/

        // #1
        link.onload = function () {
            call();
        };

        // #2
        if (link.addEventListener) {
            link.addEventListener("load", function () {
                call();
            });
        }

        // #3
        link.onreadystatechange = function() {
            var state = link.readyState;
            if (state === 'loaded' || state === 'complete') {
                link.onreadystatechange = null;
                call();
            }
        };

        // na przeglądarkach starej generacji niech będzie działał ułomny mechanizm
        if (!browserTest()) {
            cssnum = document.styleSheets.length;
            ti = setInterval(function() {
                if (document.styleSheets.length > cssnum) {
                    // needs more work when you load a bunch of CSS files quickly
                    // e.g. loop from cssnum to the new length, looking
                    // for the document.styleSheets[n].href === url
                    // ...

                    // FF changes the length prematurely :()
                    call();
                    clearInterval(ti);
                }
            }, 10);
        }

        head.appendChild(link);
    }

    /**
     * Ładowanie arkusza
     * @param {String|Array} filename
     * @param {Function} [callback]
     * @param {Object} [elemAttributes]
     * @param {number} [callTimeout]
     */
    function inject(filename, callback, elemAttributes, callTimeout) {
        var path, multipleCallback, multipleLoads = 0, i,
            ctimeout = callTimeout || callbackTimeout;

        if (Array.isArray(filename)) {
            multipleCallback = function () {
                ++multipleLoads;
                if (multipleLoads === filename.length && callback) {
                    callback();
                }
            };

            for (i = 0; i < filename.length; ++i) {
                if (typeof filename[i] !== 'string') {
                    throw new TypeError('Filename is not string');
                }

                inject(filename[i], multipleCallback, elemAttributes, callTimeout);
            }
        } else {
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

            path = getDomainPath() + path;

            if (injected[path] === undefined) {
                injected[path] = true;
                styleSheetCreate(path, callback || function () {}, elemAttributes, ctimeout);
            } else if (callback) {
                callback();
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
        inject: inject,
        mode: setInjectMode,
        setDomainPath: setDomainPath,
        setBasePath: setBasePath,
        setPatternPath: setPatternPath,
        definePath: definePath,
        setCallbackTimeout: setCallbackTimeout
    };

    define("webui-cssloader", function () {
        return module;
    });
}());
