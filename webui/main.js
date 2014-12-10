/*globals require, define*/
require.config({
});

define("jquery", function () {
    "use strict";
    return jQuery;
});

define("bootstrap", ['jquery'], function ($) {
    "use strict";
    return $;
});
