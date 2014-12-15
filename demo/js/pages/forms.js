require(['jquery', 'jquery.app'], function ($, app) {
    "use strict";

    app.theme.ready(function() {
        require(['selectize'], function () {
            $("#selectize1").selectize({
                copyClassesToDropdown: false
            });

            $("#selectize2").selectize({
                copyClassesToDropdown: false
            });
        });
    });
});
