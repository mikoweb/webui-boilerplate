require(['jquery', 'jquery.app', 'selectize', 'webui-cssloader'], function ($, app, Selectize, loader) {
    "use strict";

    loader.inject('@selectize', function () {
        $("#selectize1, #selectize2, #selectize3, #selectize4").selectize({
            copyClassesToDropdown: false
        });
    });
});
