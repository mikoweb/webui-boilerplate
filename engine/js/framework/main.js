(function () {
    "use strict";

    define('jquery', [], function () {
        return jQuery;
    });

    define('bootstrap', ['jquery'], function ($) {
        return $;
    });

    if (typeof _ !== 'undefined') {
        define('underscore', [], function() {
            return _;
        });
    }

    if (typeof Backbone !== 'undefined') {
        define('backbone', ['underscore', 'jquery'], function() {
            return Backbone;
        });
    }

    if (typeof Marionette !== 'undefined') {
        define('marionette', ['backbone'], function() {
            return Marionette;
        });
    }

    var used = false;
    function vendor(path, locale, config) {
        if (!used) {
            var pathPart = document.createElement('a'), key;
            pathPart.href= path;
            locale = locale || 'en';

            if (config.paths) {
                for (key in config.paths) {
                    if (config.paths.hasOwnProperty(key)) {
                        config.paths[key] = config.paths[key]
                            .replace(/\{\{path\}\}/g, path)
                            .replace(/\{\{pathname\}\}/g, pathPart.pathname)
                            .replace(/\{\{locale\}\}/g, locale)
                        ;
                    }
                }
            }

            require.config(config);
            used = true;
        }
    }

    define('webui-vendor', function () {
        return vendor;
    });
}());
