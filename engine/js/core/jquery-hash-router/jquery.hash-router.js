/**
 * jQuery Hash Router
 * Mechanizm trasowania
 *
 * @url https://github.com/mikoweb/jQuery_Hash_Router
 * @package jquery.hash-router
 * @author Rafał Mikołajun <rafal@vision-web.pl>
 * @copyright 2014 Rafał Mikołajun
 * @license GPL v2
 */

(function ($) {
    "use strict";

    /**
     * Wstawia backslash przed znakami specjalnymi
     * @param {string} str
     * @returns {string}
     */
    var regEscape = function(str) {
        var specials = [
                '/', '.', '*', '+', '?', '$', '^',
                '(', ')', '[', ']', '{', '}', '\\'
            ];
        return str.replace(new RegExp('(\\' + specials.join('|\\') + ')', 'gim'), '\\$1');
    },

    /**
     * Mechanizm trasowania
     * @returns {Object}
     */
    hashRouter = (function () {
            // trasy
        var route = {},

            // separatory
            separators = {
                words: '-_', // separatory wyrazów
                expression: ',~:;.', // separatory wyrażeń
                special: '%', // znaki specjalne
                group: '/', // separator rozdzielający grupy wyrażeń
                decimal: '|' // separator dziesiętny
            },

            // niedozwolone znaki
            illegalChars = /[`\^="<>\[\]\{\}\(\)!@#\$&\*\+\?']+/g,

            // główny katalog
            rootPath = '',

            // aktualny stan
            current = {
                path:       '',
                route:      null
            },

            /*
             * rodzaje filtrów
             * %s - string
             * %f - float
             * %u - unsigned
             * %d - integer
             */
            filters = 's|f|u|d',

            // gotowość routera
            ready = false,

            /* zdarzenia routera
             *
             * przykład:
             * Kiedy nastąpi wywołanie Window.onhashchange
             * router wywoła kolejno wszystkie funkcje z tablicy on.change
             */
            on = {
                change: []
            };

        // domyślne wpisy routera
        route[separators.group] = {};
        route[separators.group][separators.group] = null;

        // ustawienie głównego katalogu
        rootPath = route[separators.group];

        /**
         * Walidacja ścieżki
         * @param {string} path
         * @return {string}
         */
        function validatePath(path) {
            if (!(path && typeof path === 'string' && path.charAt(0) === separators.group && path.search("\\\\") === -1 && path.search("//") === -1)) {
                throw new Error('Is only allowed string separated by a slash. First char must be slash. Backslash is unallowable.');
            }

            if (illegalChars.test(path)) {
                throw new Error('illegal chars');
            }

            if (!(new RegExp('^[a-zA-Z0-9'+regEscape(separators.expression+separators.special+separators.words+separators.group+separators.decimal)+']+$').test(path))) {
                throw new Error('incorrect path');
            }

            /*if (new RegExp('(%{1}[^'+filters+']{1})').test(path)) {
                throw new Error('Illegal variable. Only: %s, %u, %f, %d');
            }*/

            return path.replace(/\/$/, ""); // usuwaj slash na końcu
        }

        /**
         * Rozbijanie ścieżki sepratorem slash
         * @param {string} path
         * @returns {Array.<string>|null}
         */
        function splitPath(path) {
            try {
                path = validatePath(path);
                return path.split(separators.group);
            } catch (e) {
                //console.warn(e.name+': '+ e.message);
                return [];
            }
        }

        /**
         * Odnajdywanie parametrów %s, %f, %u, %d
         * Opcjonalny parametr type jest tablicą zawęrzającą poszukiwanie do określonych typów
         * np. type = ['%f', '%d', '%u'] będzie szukać samych wartości numerycznych
         *
         * @param {string} word
         * @param {Array.<string>} [type]
         * @returns {string}
         */
        function searchParams(word, type) {
            var i, split = word.split(new RegExp('(%{1}['+filters+']{1})')),// rozbijanie tekstu jeśli znajdzie: %s, %f, %d, %u
                /**
                 * Rekurencyjna funkcja replace
                 * @param {string} str
                 * @param {RegExp} pattern
                 * @param {string} what
                 * @returns {*}
                 */
                replacerec = function (str, pattern, what) {
                    var newstr = str.replace(pattern, what);
                    if (newstr === str) {
                        return newstr;
                    }
                    return replacerec(newstr, pattern, what);
                },

                /**
                 * Korekta parametrów
                 * @param {string} str
                 * @returns {*}
                 */
                correction = function(str) {
                    // '%s{separators.words}%s' == '%s'
                    str = replacerec(str, new RegExp('%s(['+regEscape(separators.words)+'])*%s', 'g'), '%s');

                    // '%f%d%u%f%f%d' == '%u'
                    str = replacerec(str, new RegExp('%{1}['+filters.replace('s', '')+']{1}(%{1}['+filters.replace('s', '')+']{1})+|(%{1}['+filters.replace('s', '')+']{1})+%{1}['+filters.replace('s', '')+']{1}', 'g'), '%u');

                    // '%u%s%f%s%d' == '%s'
                    str = replacerec(str, new RegExp('%s(%{1}['+filters+']{1})+|(%{1}['+filters+']{1})+%s', 'g'), '%s');

                    // wszystkie paramentry w bezpośrednim położeniu znaków alfanumerycznych są parametrem %s
                    str = replacerec(str, new RegExp('[a-zA-Z0-9]+(%{1}['+filters+']{1})+|(%{1}['+filters+']{1})+[a-zA-Z0-9]+', 'g'), '%s');

                    // zamień podwójny znak procenta na pojedynczy
                    str = replacerec(str,  new RegExp('%%', 'g'), '%');
                    return str;
                };

            for (i = 0; i < split.length; i++) {
                // nie szukaj parametrów w innych parametrach
                if (split[i].charAt(0) !== '%') {
                    if (type === undefined || type.indexOf("%s") !== -1) {
                        // string
                        split[i] = split[i].replace(/([a-zA-Z])+/g, '%s');
                    }

                    if (type === undefined || type.indexOf("%f") !== -1) {
                        // float ujemny - wykrywany tylko na początku wyrażenia
                        split[i] = split[i].replace(/^(\-){1}(\d+(\|\d+){1})/g, '%f');
                        // float dodatni
                        split[i] = split[i].replace(/(\d+(\|\d+){1})/g, '%f');
                    }

                    if (type === undefined || type.indexOf("%d") !== -1) {
                        // integer - wykrywany tylko na początku wyrażenia
                        split[i] = split[i].replace(/^(\-){1}\d+/g, '%d');
                    }

                    if (type === undefined || type.indexOf("%u") !== -1) {
                        // unsigned
                        split[i] =split[i].replace(/\d+/g, '%u');
                    }
                }
            }

            return correction(split.join(''));
        }

        /**
         * Sprawdź czy wyraz pasuje do wzorca
         * @param {string} word
         * @param {string} pattern
         * @returns {Object}
         */
        function fitPattern(word, pattern) {
            var result = {test: true, result: []}, regP, reg, reg2, test, match, i,
                ival = {from: -1, to: -1},
                ival2 = {from: -1, to: -1};

            /**
             * Najpierw sprawdza czy są identyczne.
             * Jeśli nie to szuka parametrów w zmiennej a i porównuje ponownie.
             * Dodatkowo uwzględnia, że zbiór %U jest częścią zbioru %D.
             *
             * @param {string} word
             * @param {string} pattern
             * @returns {boolean}
             */
            function fit(word, pattern) {
                var result = false, withParams = '';

                if (word === pattern) {
                    result = true;
                } else {
                    withParams = searchParams(word);
                    if (withParams === '%u') {
                        result =  (pattern === '%u' || pattern === '%d');
                    } else {
                        result = withParams === pattern;
                    }
                }

                return result;
            }

            regP = '['+regEscape(separators.expression)+']'; // rozbijanie separatorem wyrażeń
            reg = new RegExp(regP, 'g');
            reg2 =  new RegExp(regP, 'g');

            /**
             * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
             * porównywanie wyrażeń jeden po drugim
             * jeśli wyrażenia do siebie nie pasują przerwij
             */
            while (null !== (test = reg.exec(word))) {
                result.test = false;
                ival.form = ival.to+1;
                ival.to = test.index;

                match = reg2.exec(pattern);
                if (match !== null) {
                    ival2.form = ival2.to+1;
                    ival2.to = match.index;

                    result.test = fit(word.substring(ival.form, ival.to), pattern.substring(ival2.form, ival2.to));
                    if (result.test && new RegExp('%{1}['+filters+']{1}').test(pattern.substring(ival2.form, ival2.to))) {
                        result.result.push(word.substring(ival.form, ival.to));
                    }
                }

                if (!result.test) {
                    break;
                }
            }

            if (result.test) {
                result.test = fit(word.substring(ival.to+1), pattern.substring(ival2.to+1));
                if (result.test && new RegExp('%{1}['+filters+']{1}').test(pattern.substring(ival2.to+1))) {
                    result.result.push(word.substring(ival.to+1));
                }
            }

            // zamiana separatora dziesiętnego na znak kropki
            for (i = 0; i < result.result.length; i++) {
                result.result[i] = result.result[i].replace(new RegExp('['+separators.decimal+']{1}', 'g'), '.');
            }

            return result;
        }

        /**
         * Zwraca obiekt zdarzenia przypisanego do trasy
         *
         * @param {string} path
         * @param {Array} [mode]
         * @returns {Object}
         */
        function getRouteEvent(path, mode) {
            var result = {event: null, args: [], pattern: ''},
                map = splitPath(path),
                candidate = [], i, k, depth, searched = [], fit, skip, arrCopy;

            if (!Array.isArray(mode)) {
                mode = [];
            }

            if (mode.indexOf('noparams') !== -1  && new RegExp('(%{1}['+filters+']{1})').test(path)) {
                throw new Error('if "noparams" mode is enabled params %* are disabled');
            }

            if (map && Array.isArray(map) && map.length) {
                // jeśli jest tylko jeden element to znaczy, że ścieżka prowadzi do katalogu root
                if (map.length === 1 && rootPath[separators.group] !== null) {
                    result.event = rootPath[separators.group];
                } else if (map.length > 1) {
                    // przygotowanie zmiennych do wyszukiwania
                    candidate[0] = {
                        obj: rootPath,
                        args: [],
                        pattern: ''
                    };

                    for (depth = 1; depth < map.length; depth++) {
                        // wyszukiwanie kandydatów
                        searched.length = 0;
                        for (i = 0; i < candidate.length; i++) {
                            skip = null;
                            // wyrażenie statyczne ma pierwszeństwo
                            if (!new RegExp('(%{1}['+filters+']{1})').test(map[depth]) && typeof candidate[i].obj[map[depth]] === 'object') {
                                arrCopy = $.merge([], candidate[i].args);
                                searched.push({
                                    obj: candidate[i].obj[map[depth]],
                                    args: arrCopy,
                                    pattern: candidate[i].pattern + separators.group + map[depth]
                                });
                                skip = map[depth];
                            }

                            // szukaj wyrażeń dynamicznych (z parametrami %*)
                            for (k in candidate[i].obj) {
                                if (candidate[i].obj.hasOwnProperty(k) && k !== separators.group && k !== skip) {
                                    fit = fitPattern(map[depth], k);
                                    if (fit.test) { // srawdź czy pasuje do wzorca
                                        arrCopy = $.merge([], candidate[i].args);
                                        arrCopy.push(fit.result);
                                        searched.push({
                                            obj: candidate[i].obj[k],
                                            args: arrCopy,
                                            pattern: candidate[i].pattern + separators.group + k
                                        });
                                    }
                                }
                            }
                        }

                        // nowe wartości tablicy kandydatów
                        candidate.length = 0;
                        for (i = 0; i < searched.length; i++) {
                            candidate[i] = searched[i];
                        }

                        // zatrzymaj jeśli nie znajdzie kandydatów
                        if (candidate.length === 0) {
                            break;
                        }
                    }
                }

                if (typeof candidate[0] === 'object') {
                    result.event = candidate[0].obj[separators.group];
                    result.args = candidate[0].args;
                    result.pattern = candidate[0].pattern;
                }
            }

            return result;
        }

        /**
         * Sprawdza czy ścieżka istnieje
         * @param {string} path
         * @returns {boolean}
         */
        function exists(path) {
            path = searchParams(path, ['%']); // skoryguj parametry
            var i, map = splitPath(path),
                s = rootPath, result = true;

            if (map.length > 1) {
                for (i = 1; i < map.length; i++) {
                    if (s[map[i]] === undefined) {
                        result = false;
                        break;
                    }

                    result = true;
                    s = s[map[i]];
                }
            }

            return result && s[separators.group] !== null;
        }

        /**
         * Dodaje nową trasę do routera
         * @param {string} path
         * @param {$.hashRouter.controller} controller
         * @returns {$.hashRouter.controller|boolean}
         */
        function addRoute(path, controller) {
            if (!$.hashRouter.controller.prototype.isPrototypeOf(controller)) {
                throw new Error('second parameter is not $.hashRouter.controller');
            }

            path = searchParams(path, ['%']); // skoryguj parametry
            if (exists(path)) {
                throw new Error('path: ' + path + ' is declared');
            }

            var i,
                map = splitPath(path),
                s = rootPath, result = false;

            if (map.length > 1) {
                // tworzenie trasy
                for (i = 1; i < map.length; i++) {
                    if (s[map[i]] === undefined) {
                        s[map[i]] = {};
                        s[map[i]][separators.group] = null;
                    }
                    s = s[map[i]];
                }

                controller.ready({ // przygotowanie kontrolera
                    path: path
                });
                s[separators.group] = controller;
                result = controller;
            }

            return result;
        }

        /**
         * Zmiana aktualnego stanu routera
         * @returns {void}
         */
        function setCurrent() {
            if (location.hash.charAt(1) === separators.group) {
                current.path    = location.hash.substring(1);
                try {
                    current.route = getRouteEvent(current.path, ['noparams']);
                } catch (e) {
                    current.route = {event: null, args: [], pattern: ''};
                    //console.warn(e.name+': '+ e.message);
                }
            } else {
                current.path = '';
                current.route = {event: null, args: [], pattern: ''};
            }
        }

        /**
         * Przygotowanie routera do gotowości.
         * Po wywołaniu tej funkcji nie będzie można
         * dodawać tras na zewnatrz obiektu.
         *
         * @returns {void}
         */
        function getReady() {
            ready = true;
            $(window).hashchange();
        }

        /**
         * Zatrzymanie gotowości.
         * Można spowrotem dodawać trasy.
         *
         * @returns {void}
         */
        function stopReady() {
            ready = false;
        }

        /**
         * Definiowanie nowego zdarzenia routera
         * @param {string} name
         * @param {function} func
         * @returns {boolean}
         */
        function defineEvent(name, func) {
            var result = false;
            if (Array.isArray(on[name]) && typeof func === 'function') {
                on[name].push(func);
                result = true;
            }
            return result;
        }

        /**
         * Wywołaj zdarzenie routera
         * @param {string} name
         * @param {Array} [args]
         */
        function callEvent(name, args) {
            var i;

            if (Array.isArray(on[name]) && (args === undefined || Array.isArray(args))) {
                for (i = 0; i < on[name].length; i++) {
                    if (typeof on[name][i] === 'function') {
                        on[name][i].apply(null, args);
                    }
                }
            }
        }

        // Przechwytywanie ścieżki
        $(window).hashchange(function () {
            if (ready) {
                setCurrent();
                callEvent('change', [{
                    args: current.route.args,
                    path: current.path,
                    pattern: current.route.pattern
                }]);

                if (current.route && $.hashRouter.controller.prototype.isPrototypeOf(current.route.event)) {
                    current.route.event.call(current.route.args, current.route.pattern, current.path);
                }
            }
        });

        // Metody publiczne
        return {
            /**
             * @param {string} path
             * @param {$.hashRouter.controller} controller
             * @returns {boolean}
             */
            addRoute: function (path, controller) {
                var result = false;
                if (!ready) {
                    try {
                        result = addRoute(path, controller);
                    } catch (e) {
                        //console.warn(e.name+': '+ e.message);
                    }
                }

                return result;
            },
            getReady: function() {
                getReady();
            },
            stopReady: function() {
                stopReady();
            },
            /**
             * Zwraca kopie obiektu route
             * @returns {*}
             */
            getClone: function() {
                return $.extend(true, {}, route);
            },
            on: function(name, func) {
                return defineEvent(name, func);
            }
        };
    }());

    // $.hashRouter
    Object.defineProperty($, "hashRouter", {
        /**
         * Referencja do routera
         * @return {hashRouter}
         */
        value: function () {
            return hashRouter;
        }
    });

    // $.hashRouter.event
    Object.defineProperty($.hashRouter, "event", {
        /**
         * Zdarzenie routingu
         * @param {Object.<function>} [setup]
         * @returns {$.hashRouter.event.prototype}
         */
        value: function (setup) {
            return Object.create($.hashRouter.event.prototype, {
                action: {
                    value: (setup && typeof setup.action === 'function' ? setup.action : function(container, properties) {})
                },
                before: {
                    value: (setup && typeof setup.before === 'function' ? setup.before : function(container, properties) {})
                },
                after: {
                    value: (setup && typeof setup.after === 'function' ? setup.after : function(container, properties) {})
                },
                error: {
                    value: (setup && typeof setup.error === 'function' ? setup.error : function(e, container, properties) {})
                }
            });
        }
    });

    // $.hashRouter.Response
    Object.defineProperty($.hashRouter, "Response", {
        /**
         * Prototyp odpowiedzi
         */
        value: Object.create(Object.prototype)
    });

    // $.hashRouter.Response.create
    Object.defineProperty($.hashRouter.Response, "create", {
        /**
         * Tworzy nową instancje prototypu
         * @param {Object} setup
         * @param {$.hashRouter.Response} [spec]
         */
        value: function(setup, spec) {
            var response = $.hashRouter.Response.isPrototypeOf(spec) === true ? spec : Object.create(this);

            if (typeof setup !== 'object') {
                setup = {};
            }

            Object.defineProperty(response, "container", {
                /**
                 * Element drzewa DOM bądź węzeł, do którego zostanie załadowana odpowiedź
                 */
                value: (setup.container instanceof jQuery ? setup.container : $('<div />'))
            });

            return response;
        }
    });

    // $.hashRouter.Response.capture
    Object.defineProperty($.hashRouter.Response, "capture", {
        /**
         * Przechwytywanie
         * @param {$.hashRouter.event} event
         * @param {Object} properties
         */
        value: function(event, properties) {
            (function(that) {
                try {
                    event.before(that.container, properties);
                    event.action(that.container, properties);
                    event.after(that.container, properties);
                } catch (e) {
                    event.error(e, that.container, properties);
                }
            }(this));
        }
    });

    // $.hashRouter.Navigation
    Object.defineProperty($.hashRouter, "Navigation", {
        /**
         * Prototyp nawigacji
         */
        value: Object.create(Object.prototype)
    });

    // $.hashRouter.Navigation.create
    Object.defineProperty($.hashRouter.Navigation, "create", {
        /**
         * Tworzy nową instancje prototypu
         * @param {Object} setup
         * @param {$.hashRouter.Navigation} [spec]
         */
        value: function(setup, spec) {
            var navigation = $.hashRouter.Navigation.isPrototypeOf(spec) === true ? spec : Object.create(this);

            if (typeof setup !== 'object') {
                setup = {};
            }

            Object.defineProperty(navigation, "container", {
                /**
                 * Element drzewa DOM bądź węzeł, w którym będą wyszukiwane odnośniki
                 */
                value: (setup.container instanceof jQuery ? setup.container : $('<div />'))
            });

            Object.defineProperty(navigation, "itemsQuery", {
                /**
                 * Zapytanie jQuery wskazujące na elementy wewnątrz węzła container
                 */
                value: (typeof setup.itemsQuery === 'string' ? setup.itemsQuery : '> a')
            });

            Object.defineProperty(navigation, "eventName", {
                value: (function(name) {
                    var result = 'click';
                    if (typeof name === 'string' && /^((\s)*[a-zA-Z]{1}(\s)*)+$/g.test(name)) {
                        result = name;
                    }
                    return result;
                }(setup.eventName))
            });

            Object.defineProperty(navigation, "onEvent", {
                value: (typeof setup.onEvent === 'function' ? setup.onEvent : function (params, container, item) {
                    location.hash = $.sprintf.apply(null, $.merge([this.getPath()], params));
                })
            });

            return navigation;
        }
    });

    // $.hashRouter.Navigation.getPath
    Object.defineProperty($.hashRouter.Navigation, "getPath", {
        /**
         * Funkcja zwraca ścieżkę do przypisanej trasy.
         * Domyślnie funkcja jest pusta. Zostanie podmieniona wewnątrz kontrolera.
         */
        value: function() {
            return null;
        },
        writable: true
    });

    // $.hashRouter.Navigation.build
    Object.defineProperty($.hashRouter.Navigation, "build", {
        /**
         * Zbuduj nawigacje na bazie otrzymanych pól
         */
        value: function() {
            var that = this,
                result = true;

            // zatrzymaj odnośniki
            that.container.on('click', that.itemsQuery, function() {
                var result = true;
                if ($(this).prop("tagName").toLowerCase() === 'a') {
                    result = false;
                }
                return result;
            });

            // zatrzymaj odnośniki wewnętrzne
            that.container.on('click', that.itemsQuery+' a', function() {
                return false;
            });

            // zdarzenie
            that.container.on(that.eventName, that.itemsQuery, function() {
                var $this = $(this),
                    params = ($this.data('params') !== undefined && typeof $this.data('params') !== 'object' ? $this.data('params').toString() : '');

                that.onEvent(params.split('/'), that.container, $this);
            });
        }
    });

    // $.hashRouter.Model
    Object.defineProperty($.hashRouter, "Model", {
        /**
         * Prototyp modelu
         */
        value: Object.create(Object.prototype)
    });

    // $.hashRouter.Model.create
    Object.defineProperty($.hashRouter.Model, "create", {
        /**
         * Tworzy nową instancje prototypu
         */
        value: function() {
            return Object.create(this);
        }
    });

    // $.hashRouter.Model.getProperties
    Object.defineProperty($.hashRouter.Model, "getProperties", {
        /**
         * Zwraca kopię pól, gdzie deskryptor => enumerable: true
         */
        value: function() {
            var keys = Object.keys(Object.getPrototypeOf(this)), i, copy = {};
            for (i=0; i<keys.length; i++) {
                copy[keys[i]] = this[keys[i]];
            }

            return copy;
        }
    });

    // $.hashRouter.Model.event
    Object.defineProperty($.hashRouter.Model, "event", {
        /**
         * Referencja do zdarzenia
         */
        value: $.hashRouter.event(),
        writable: true
    });

    // $.hashRouter.Model.setEvent
    Object.defineProperty($.hashRouter.Model, "setEvent", {
        /**
         * Ustaw zdarzenie routingu
         * @param {$.hashRouter.event} val
         */
        value: function(val) {
            if ($.hashRouter.event.prototype.isPrototypeOf(val)) {
                this.event = val;
            } else {
                this.event = $.hashRouter.event();
            }
        }
    });

    // $.hashRouter.Model.response
    Object.defineProperty($.hashRouter.Model, "response", {
        /**
         * Referencja do obiektu odpowiedzi
         */
        value: $.hashRouter.Response.create(),
        writable: true
    });

    // $.hashRouter.Model.setResponse
    Object.defineProperty($.hashRouter.Model, "setResponse", {
        /**
         * Ustaw obiekt odpowiedzi
         * @param {$.hashRouter.Response} val
         */
        value: function(val) {
            if ($.hashRouter.Response.isPrototypeOf(val)) {
                this.response = val;
            } else {
                this.response = $.hashRouter.Response.create();
            }
        }
    });

    // $.hashRouter.Model.navigation
    Object.defineProperty($.hashRouter.Model, "navigation", {
        /**
         * Tablica obiektów nawigacji
         * - domyślnie null, tablica zostanie utworzona po wywowałaniu addNavigation
         */
        value: null,
        writable: true
    });

    // $.hashRouter.Model.addNavigation
    Object.defineProperty($.hashRouter.Model, "addNavigation", {
        /**
         * Dodaj nowy obiekt do tablicy nawigacji
         * @param {$.hashRouter.Navigation} val
         */
        value: function(val) {
            if (!Array.isArray(this.navigation)) {
                this.navigation = [];
            }

            if ($.hashRouter.Navigation.isPrototypeOf(val)) {
                this.navigation.push(val);
            }
        }
    });

    // $.hashRouter.Model.pattern
    Object.defineProperty($.hashRouter.Model, "pattern", {
        /**
         * Wzorzec ścieżki przechwycony przez router
         */
        value: '',
        writable: true,
        enumerable: true
    });

    // $.hashRouter.Model.args
    Object.defineProperty($.hashRouter.Model, "args", {
        /**
         * Paremetry ścieżki przechwycone przez router
         */
        value: [],
        writable: true,
        enumerable: true
    });

    // $.hashRouter.Model.path
    Object.defineProperty($.hashRouter.Model, "path", {
        /**
         * Ścieżka przechwycona przez router
         */
        value: '',
        writable: true,
        enumerable: true
    });

    // $.hashRouter.Model.update
    Object.defineProperty($.hashRouter.Model, "update", {
        /**
         * Aktualizuj dane
         * @param {Object} data
         */
        value: function(data) {
            if (typeof data === 'object') {
                // zaktualizuj parametry ścieżki
                this.args = (Array.isArray(data.args) === true ? data.args : []);

                // zaktualizuj wzorzec ścieżki
                this.pattern = (typeof data.pattern === 'string' ? data.pattern : '');

                // zaktualizuj ścieżkę
                this.path = (typeof data.path === 'string' ? data.path : '');
            }

            // przechwyć odpowiedź
            this.response.capture(this.event, this.getProperties());
        }
    });

    // $.hashRouter.controller
    Object.defineProperty($.hashRouter, "controller", {
        /**
         * Konstruktor kontrolera
         * @returns {$.hashRouter.controller.prototype}
         */
        value: function () {
            var model = $.hashRouter.Model.create(),
                path = null, ready = false;

            // Metody publiczne
            return Object.create($.hashRouter.controller.prototype, {
                ready: {
                    /**
                     * Czy kontroler jest gotowy?
                     * Funkcja zostanie wywołanaz parametrem setup gdy nastąpi dodanie ścieżki do routera (addRoute).
                     *
                     * @param {Object} [setup]
                     * @returns {boolean}
                     */
                    value: function(setup) {
                        var i;

                        if (!ready) {
                            if (typeof setup === 'object') {
                                path = (typeof setup.path === 'string' ? setup.path : null);
                                ready = true;
                            }

                            if (Array.isArray(model.navigation)) {
                                for (i = 0; i < model.navigation.length; i++) {
                                    model.navigation[i].build(); // budowanie nawigacji
                                }
                            }
                        }

                        return ready;
                    }
                },
                getPath: {
                    /**
                     * @returns {string|null}
                     */
                    value: function() {
                        return path;
                    }
                },
                setEvent: {
                    /**
                     * @param {Object} setup
                     * @returns {$.hashRouter.controller}
                     */
                    value: function(setup) {
                        model.setEvent($.hashRouter.event(setup));
                        return this;
                    }
                },
                setResponse: {
                    /**
                     * @param {Object} setup
                     * @param {string} responseType
                     * @returns {$.hashRouter.controller}
                     */
                    value: function(setup, responseType) {
                        if ($.hashRouter.Response.isPrototypeOf($.hashRouter[responseType])) {
                            model.setResponse($.hashRouter[responseType].create(setup));
                        } else {
                            model.setResponse($.hashRouter.Response.create(setup));
                        }
                        return this;
                    }
                },
                addNavigation: {
                    /**
                     * @param {Object} setup
                     * @param {string} navType
                     * @returns {$.hashRouter.controller}
                     */
                    value: function(setup, navType) {
                        var nav;
                        if ($.hashRouter.Navigation.isPrototypeOf($.hashRouter[navType])) {
                            nav = $.hashRouter[navType].create(setup);
                        } else {
                            nav = $.hashRouter.Navigation.create(setup);
                        }

                        nav.getPath = function() {
                            return path;
                        };
                        model.addNavigation(nav);

                        return this;
                    }
                },
                call: {
                    /**
                     * Aktualizacja danych.
                     * Funkcja jest wywoływana wewnątrz routera.
                     *
                     * @param {Array} args
                     * @param {string} pattern
                     * @param {string} path
                     */
                    value: function(args, pattern, path) {
                        model.update({
                            args: args,
                            path: path,
                            pattern: pattern
                        });
                    }
                }
            });
        }
    });

}(jQuery));