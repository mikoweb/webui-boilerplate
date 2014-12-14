/*
 * This file is part of the Joomla Rapid Framework
 *
 * website: www.vision-web.pl
 * (c) Rafał Mikołajun <rafal@vision-web.pl>
 */

/**
 * Loader skryptów wykorzystujący yepnope.
 * @author Rafał Mikołajun <rafal@vision-web.pl>
 * @package Joomla Rapid Framework
 * @copyright 2014 Rafał Mikołajun
 * @license GPL v2
 */

var jsloader = (function() {
    "use strict";

    var requirements, initialized = false,
        scripts = {}, unknown = [], waiting = [],
        injectTimeout = 5000, loadEvent = {}, loadAllEvent = [],
        nonloaded = 0;

    /**
     * tablica zawierająca zestaw testów pod kątem wymagań strony względem przeglądarki
     * format: {test: yepnope_callback, complete: false}
     * @type {Array}
     */
    requirements = [];
    requirements.many = 0;

    /**
     * Wywołaj mnie jeśli jestem funkcją
     * @param {Function} test
     */
    function callFunction(test) {
        if (typeof test === 'function') {
            test();
        }
    }

    /**
     * Dodaj nowe wymaganie
     * @param {Object} options
     */
    function addRequirement(options) {
        if (typeof options === 'object') {
            var requirement, config = {}, k;

            for (k in options) {
                if (options.hasOwnProperty(k)) {
                    config[k] = options[k];
                }
            }

            requirement = {
                complete: false,
                test: function (callback) {
                    config.complete = function () {
                        if (requirements.many === 1) {
                            callFunction(callback);
                        }

                        requirement.complete = true;
                        requirements.many--;
                    };

                    yepnope(config);
                }
            };

            requirements.push(requirement);
            requirements.many++;
        }
    }

    /**
     * Wstaw nową grupę skryptów
     * @param {string} name
     * @param {Array} [dependencies]
     */
    function addGroup(name, dependencies) {
        if (typeof name !== 'string') {
            throw new Error('name is not string');
        }

        if (scripts[name] === undefined) {
            scripts[name] = (function () {
                var group = [];
                group.dependencies = Array.isArray(dependencies) ? dependencies : [];
                group.load = false;
                group.beforeLoad = false;
                group.onload = [];

                nonloaded++;
                return group;
            }());
        } else {
            throw new Error("group '" + name + "' is declared");
        }
    }

    /**
     * Nowa lista skryptów do załadowania
     * @param {string} group
     * @param {Array} files
     * @param {bool} [async]
     */
    function addScript(group, files, async) {
        if (typeof group !== 'string') {
            throw new Error('group name is not string');
        }

        if (!Array.isArray(files)) {
            throw new Error('files is not Array');
        }

        if (async === undefined) {
            async = true;
        }

        var arr = scripts[group] !== undefined ? scripts[group] : unknown;

        arr.push({
            files: files,
            async: async ? true : false
        });
    }

    /**
     * Rozpocznij testowanie przeglądarki
     * @param {Function} callback
     */
    function runTest(callback) {
        var i;

        if (requirements.many > 0) {
            for (i = 0; i < requirements.length; i++) {
                if (!requirements[i].complete) {
                    requirements[i].test(callback);
                }
            }
        }
    }

    /**
     * zarejestruj zdarzenie onLoad
     * @param {string|Function} [arg1]
     * @param {Function} [arg2]
     */
    function addOnLoadEvent(arg1, arg2) {
        // tylko dla jednej grupy
        if (arguments.length === 2
            && typeof arg1 === 'string'
            && typeof arg2 === 'function'
        ) {
            if (loadEvent[arg1] === undefined) {
                loadEvent[arg1] = [];
            }

            if (scripts[arg1] !== undefined && scripts[arg1].load) {
                // jeśli onload już nastąpiło uruchom funkcję teraz
                callFunction(arg2);
            } else {
                // zarejestruj funkcję na liście
                loadEvent[arg1].push(arg2);
            }
        } else if (arguments.length === 1 && typeof arg1 === 'function') {
            if (nonloaded === 0) {
                // jeśli wszystkie grupy załadowane
                callFunction(arg1);
            } else {
                // dodaj na listę
                loadAllEvent.push(arg1);
            }
        }
    }

    /**
     * uruchom zdarzenie onLoad
     * @param {string} group
     */
    function onLoadEvent(group) {
        var i;

        // tylko jedna grupa
        if (typeof group === 'string' && loadEvent[group] !== undefined) {
            for (i = 0; i < loadEvent[group].length; i++) {
                loadEvent[group][i]();
            }

            // na koniec wyczyść
            loadEvent[group] = [];
        }

        // uruchom kiedy wszystkie grupy będą załadowane
        if (nonloaded === 0) {
            for (i = 0; i < loadAllEvent.length; i++) {
                callFunction(loadAllEvent[i]);
            }
            loadAllEvent = [];
        }
    }

    /**
     * wstrzyknij skrypt
     * @param {string} url
     * @param {Function} callback
     */
    function inject(url, callback) {
        yepnope.injectJs(url, function () {
            callFunction(callback);
        }, {
            charset: "utf-8",
            type: "text/javascript"
        }, injectTimeout);
    }

    /**
     * ładowarka skryptów
     * @param {Array} res
     * @param {bool} async
     * @param {function} [callback]
     */
    function loader(res, async, callback) {
        if (!Array.isArray(res)) {
            throw new Error('res is not Array');
        }

        var i, helper;

        if (res.length) {
            if (async) {
                // przy każdym załadowaniu zmniejszaj licznik
                helper = (function (left) {
                    return function () {
                        left--;
                        if (left === 0) {
                            // gdy zostanie 0 uruchom callback
                            callFunction(callback);
                        }
                    };
                }(res.length));

                // asynchroniczne ładowanie
                for (i = 0; i < res.length; i++) {
                    inject(res[i], helper);
                }
            } else {
                helper = function (i) {
                    if (i === res.length) {
                        callFunction(callback);
                    } else {
                        inject(res[i], function () {
                            helper(i+1);
                        });
                    }
                };

                // synchroniczne ładowanie
                helper(0);
            }
        } else {
            // jeśli nic nie ma odrazu funkcja wołaj funkcje zwrotną
            callFunction(callback);
        }
    }

    /**
     * wstrzyknij wszytskie skrypty z podanej grupy
     * @param {string} name
     * @param {Function} [callback]
     */
    function injectAll(name, callback) {
        if (typeof name !== 'string') {
            throw new Error('group name is not string');
        }

        var script = scripts[name],
            load, i, depeLoad;

        if (script !== undefined && !script.load && !script.beforeLoad) {
            script.beforeLoad = true;
            load = function () {
                var i, onload;

                // co zrobić po załadowaniu
                onload = (function (left) {
                    return function () {
                        var i;

                        left--;
                        if (left < 1) {
                            // oznacz grupę jako załadowaną
                            nonloaded--;
                            script.load = true;
                            script.beforeLoad = false;
                            for (i = 0; i < script.onload.length; i++) {
                                callFunction(script.onload[i]);
                            }
                            script.onload = [];
                            onLoadEvent(name);
                            callFunction(callback);
                        }
                    };
                }(script.length));

                for (i = 0; i < script.length; i++) {
                    loader(script[i].files, script[i].async, onload);
                }

                if (script.length === 0) {
                    onload();
                }
            };

            if (script.dependencies.length === 0) {
                // jeśli brak zależności ładuj teraz
                load();
            } else {
                depeLoad = (function (left) {
                    return function () {
                        left--;
                        if (left === 0) {
                            load();
                        }
                    };
                }(script.dependencies.length));

                // najpierw załaduj wymagane grupy
                for (i = 0; i < script.dependencies.length; i++) {
                    injectAll(script.dependencies[i], depeLoad);
                }
            }
        } else if (script !== undefined && script.beforeLoad) {
            script.onload.push(callback);
        } else if (script === undefined || (script !== undefined && script.load)) {
            callFunction(callback);
        }
    }

    return {
        /**
         * Inicjalizacja loadera
         */
        init: function () {
            if (!initialized) {
                runTest(function () {
                    var i, k;

                    // dodaj listy z poczekalni
                    for (i = 0; i < waiting.length; i++) {
                        addScript(waiting[i][0], waiting[i][1], waiting[i][2]);
                    }

                    // wyczyść poczekalnie
                    waiting = [];

                    // wstrzykiwanie skryptów
                    for (k in scripts) {
                        if (scripts.hasOwnProperty(k)) {
                            injectAll(k);
                        }
                    }

                    // wstrzykiwanie nieznanych
                    for (i = 0; i < unknown.length; i++) {
                        loader(unknown[i].files, unknown[i].async);
                    }
                });

                initialized = true;
            }
        },

        /**
         * Nowe listy skryptów trafiają do poczekalni
         * @param {string} group
         * @param {Array} files
         * @param {bool} [async]
         */
        add: function (group, files, async) {
            waiting.push([group, files, async]);
        },

        /**
         * Ustaw limit czasu wczytywania jednego skryptu
         * @param {integer} timeout
         */
        timeout: function (timeout) {
            injectTimeout = timeout;
        },

        requirement: addRequirement,
        group: addGroup,
        onLoad: addOnLoadEvent
    };
}());
