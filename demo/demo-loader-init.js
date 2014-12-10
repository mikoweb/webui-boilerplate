jsloader.onLoad(function () {
    jQuery.app.theme.ready(function () {
        jQuery.hashRouter().getReady();
    });
    jQuery.app.theme.init();
});
jsloader.init();