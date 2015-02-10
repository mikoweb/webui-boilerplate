require(['jquery', 'jquery.app'], function ($, app) {
    "use strict";

    // przykład z użyciem ready
    // jeżeli skrypty są dole body to nie musisz tego używać
    app.theme.ready(function() {
        require(['selectize', 'webui-cssloader'], function (Selectize, loader) {
            loader.inject('@selectize', function () {
                $("#selectize1, #selectize2, #selectize3, #selectize4").selectize({
                    copyClassesToDropdown: false
                });
            });
        });
    });
});
