/**
 * Kontener aplikacji
 * @author Rafał Mikołajun <rafal@vision-web.pl>
 * @copyright 2014 Rafał Mikołajun
 * @license LGPLv3
 */

(function ($) {
    "use strict";

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
                var selectors = {}, elements = {},
                    init = false,
                    events = $('<div />');

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
                        init = true;
                        events.trigger('init', $.app.theme);
                    }
                }

                return {
                    init: initialize,
                    /**
                     *
                     * @param {string} e
                     * @param [selector]
                     * @param [data]
                     * @param [handler]
                     */
                    on: function (e, selector, data, handler) {
                        events.on(e, selector, data, handler);
                    },
                    /**
                     * Dodaj nowy element strony
                     * @param {Object} options
                     * @returns {boolean}
                     */
                    addElement: function (options) {
                        var name = options.name,
                            selector = options.selector,
                            parent = options.parent;

                        if (typeof name !== 'string') {
                            throw new TypeError('jQuery.app.theme.addElement: name is not string!');
                        }

                        if (typeof selector !== 'string') {
                            throw new TypeError('jQuery.app.theme.addElement: selector is not string!');
                        }

                        if (parent && typeof parent !== 'string') {
                            throw new TypeError('jQuery.app.theme.addElement: parent is not string!');
                        }

                        Object.defineProperty(selectors, name, {
                            value: {
                                selector: selector,
                                parent: parent
                            },
                            enumerable: true
                        });

                        createElement(name);

                        return true;
                    },
                    /**
                     * Czy element jest zdefiniowany
                     * @param {string} name
                     * @returns {boolean}
                     */
                    hasElement: function(name) {
                        if (!init) {
                            throw new Error('jQuery.app.theme.hasElement: Theme has not been initialized');
                        }

                        return elements[name] !== undefined;
                    },
                    /**
                     * Podaj element o podanej nazwie
                     * @param {string} name
                     * @returns {jQuery|undefined}
                     */
                    element: function (name) {
                        if (!init) {
                            throw new Error('jQuery.app.theme.element: Theme has not been initialized');
                        }

                        return elements[name];
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
