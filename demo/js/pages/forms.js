require(['jquery', 'jquery.app'], function ($, app) {
    "use strict";

    app.theme.ready(function() {
        require(['selectize'], function () {
            $("#selectize1").selectize({
                copyClassesToDropdown: false
            });
        });

        require(['selectize'], function () {
            $("#selectize2").selectize({
                copyClassesToDropdown: false
            });
        });
    });
});
