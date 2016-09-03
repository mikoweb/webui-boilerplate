/**
 * This is sample bootstrap file.
 */
function startapp (data) {
    "use strict";

    var k, i;

    // stop loading after timeout
    jsloader.timeout(data.timeout);
    // load es5-shim if browser not support
    jsloader.requirement({
        test: Modernizr.es5array && Modernizr.es5date && Modernizr.es5function && Modernizr.es5object && Modernizr.es5string,
        nope: [data.path.public + '/es5-shim.min.js', data.path.public + '/es5-sham.min.js']
    });

    for (k in data.res.resources) {
        if (data.res.resources.hasOwnProperty(k)) {
            jsloader.group(k, data.res.dependencies[k]);
            for (i = 0; i < data.res.resources[k].length; i++) {
                jsloader.add(k, data.res.resources[k][i].url, data.res.resources[k][i].async);
            }
        }
    }

    // load jQuery Mobile Events on touch device
    if (Modernizr.touchevents) {
        jsloader.add('core', [data.path.public + '/jquery.mobile.only-events.min.js'], true);
    }

    for (i = 0; i < data.res.unknown.length; i++) {
        jsloader.add('', data.res.unknown[i].url, data.res.unknown[i].url.async);
    }

    jsloader.onLoad('framework', function () {
        require(['webui-vendor'], function (vendor) {
            vendor(data.path.webui, data.locale, data.requirejs);
        });

        require(['webui-cssloader'], function (loader) {
            loader.mode('static');
            loader.setBasePath(data.path.webui);
            loader.definePath(data.cssloader);
        });
    });

    jsloader.onLoad('core', function () {
        require(['jquery'], function ($) {
            $.app.define('path_base', data.path.base);
            $.app.define('path_webui', data.path.webui);
            $.app.define('path_webui_engine', data.path.webui_engine);
            $.app.define('path_public', data.path.public);
            $.app.trans.add(data.translations);
        });
    });

    startapp = undefined;
}
