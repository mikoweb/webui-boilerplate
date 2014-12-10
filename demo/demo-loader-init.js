/*globals require, jsloader, require*/
jsloader.onLoad(function () {
    "use strict";
    require(['jquery.app', 'jquery.hash-router'], function(app, router) {
        app.theme.ready(function () {
            router.getReady();
        });
        app.theme.init();
    });
});
jsloader.init();
