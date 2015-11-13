/**
 * Kontener aplikacji
 * @author Rafał Mikołajun <rafal@vision-web.pl>
 * @copyright 2014 Rafał Mikołajun
 * @license GPL v2
 */

(function ($) {
    "use strict";

    /**
     * wywołaj funkcje z tablicy
     * @param {Array} arr
     * @param {Array} args
     */
    function callFromArray(arr, args) {
        var i;
        for (i = 0; i < arr.length; i++) {
            if ($.isFunction(arr[i])) {
                arr[i].apply(null, $.merge([], args));
            }
        }
    }

    Object.defineProperties($, {
        /**
         * kontener aplikacji
         * @memberof jQuery
         */
        "app": {
            value: (function () {
                var globals = {};
                return {
                    /**
                     * Zainicjuj nową zmienną globalną
                     * @param {string} name
                     * @param {*} value
                     * @returns {boolean}
                     */
                    define: function(name, value) {
                        if (globals[name] !== undefined) {
                            throw new Error('jQuery.app.define: property "' + name + '" was defined');
                        }

                        Object.defineProperty(globals, name, {
                            value: value
                        });

                        return true;
                    },
                    /**
                     * Podaj wartość zmiennej globalnej
                     * @param {string} name
                     * @returns {*}
                     */
                    get: function(name) {
                        return globals[name];
                    },
                    /**
                     * Czy zmienna jest zadeklarowana
                     * @param {string} name
                     * @returns {boolean}
                     */
                    has: function(name) {
                        return globals[name] !== undefined;
                    }
                };
            }())
        }
    });

    Object.defineProperties($.app, {
        /**
         * interfejs szablonu
         * @memberof jQuery.app
         */
        "theme": {
            value: (function () {
                var selectors = {}, elements = {}, init = false,
                    layoutEvents = {
                        ready: [],
                        load: [],
                        resize: [],
                        scroll: []
                    };

                /**
                 * stwórz element
                 * @param name
                 */
                function createElement(name) {
                    if (elements[name] === undefined && selectors[name] !== undefined) {
                        var parent = selectors[name].parent,
                            selector = selectors[name].selector,
                            parentNode;

                        if (parent !== undefined) {
                            // szukaj wewnątrz rodzica
                            parentNode = createElement(parent);
                            if (parentNode !== undefined) {
                                elements[name] = parentNode.find(selector);
                            }
                        } else {
                            elements[name] = $(selector);
                        }
                    }

                    return elements[name];
                }

                /**
                 * zbuduj listę elementów
                 */
                function buidListOfElements() {
                    var prop;

                    for (prop in selectors) {
                        if (selectors.hasOwnProperty(prop)) {
                            createElement(prop);
                        }
                    }
                }

                /**
                 * inicjalizacja szablonu
                 */
                function initialize() {
                    if (!init) {
                        buidListOfElements();

                        // document ready
                        $(document).ready(function() {
                            callFromArray(layoutEvents.ready, [$.app.theme]);
                        });

                        // window ready
                        $(window).load(function() {
                            callFromArray(layoutEvents.load, [$.app.theme]);
                        });

                        // window onResize
                        $(window).resize(function() {
                            callFromArray(layoutEvents.resize, [$.app.theme]);
                        });

                        // window onScroll
                        $(window).scroll(function() {
                            callFromArray(layoutEvents.scroll, [$.app.theme]);
                        });

                        init = true;
                    }
                }

                return {
                    /**
                     * inicjalizacja szablonu
                     */
                    init: initialize,
                    /**
                     * Dodaj nowy element strony
                     * @param {Object} options
                     * @returns {boolean}
                     */
                    addElement: function (options) {
                        var name = options.name,
                            selector = options.selector,
                            parent = options.parent;

                        if (typeof name === 'string'
                            && typeof selector === 'string'
                            && selectors[name] === undefined) {
                            Object.defineProperty(selectors, name, {
                                value: {
                                    selector: selector,
                                    parent: parent
                                },
                                enumerable: true
                            });
                            return true;
                        }

                        return false;
                    },
                    /**
                     * Czy element jest zdefiniowany
                     * @param {string} name
                     * @returns {boolean}
                     */
                    hasElement: function(name) {
                        return elements[name] !== undefined;
                    },
                    /**
                     * Podaj element o podanej nazwie
                     * @param {string} name
                     * @returns {jQuery|undefined}
                     */
                    element: function (name) {
                        return elements[name];
                    },
                    /**
                     * @param {Function} func
                     */
                    ready: function (func) {
                        if ($.isFunction(func)) {
                            layoutEvents.ready.push(func);
                        }
                    },
                    /**
                     * @param {Function} func
                     */
                    load: function (func) {
                        if ($.isFunction(func)) {
                            layoutEvents.load.push(func);
                        }
                    },
                    /**
                     * @param {Function} func
                     */
                    resize: function (func) {
                        if ($.isFunction(func)) {
                            layoutEvents.resize.push(func);
                        }
                    },
                    /**
                     * @param {Function} func
                     */
                    scroll: function (func) {
                        if ($.isFunction(func)) {
                            layoutEvents.scroll.push(func);
                        }
                    }
                };
            }())
        },

        /**
         * tłumaczenia
         * @memberof jQuery.app
         */
        trans: {
            value: (function () {
                var translations = {};

                return {
                    /**
                     * Dodaj tłumaczenia
                     * @param {Object.<string>} strings
                     */
                    add: function (strings) {
                        var prop;
                        for (prop in strings) {
                            if (strings.hasOwnProperty(prop)
                                && typeof strings[prop] === 'string'
                            ) {
                                if (translations[prop] !== undefined) {
                                    throw new Error('jQuery.app.trans: translation "' + prop + '" was defined');
                                }

                                translations[prop] = strings[prop];
                            }
                        }
                    },
                    /**
                     * Podaj tłumaczenie
                     * @param {string} text
                     * @returns {string}
                     */
                    get: function (text) {
                        if (translations[text] !== undefined) {
                            return translations[text];
                        }

                        return text;
                    }
                };
            }())
        }
    });

    if (typeof define !== 'undefined' && $.isFunction(define) && define.amd) {
        define("jquery.app", ['jquery'], function ($) {
            return $.app;
        });
    }
}(jQuery));
