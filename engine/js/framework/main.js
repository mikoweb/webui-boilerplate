(function () {
    "use strict";

    var used = false;
    function vendor() {
        if (!used) {
            require.config({
            });

            define("jquery", function () {
                return jQuery;
            });

            define("bootstrap", ['jquery'], function ($) {
                return $;
            });

            console.log('only one');
            used = true;
        }
    }

    define("webgui-vendor", function () {
        return vendor;
    });
}());
