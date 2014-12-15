jsloader.onLoad("framework", function () {
    "use strict";
    require(["jquery"], function ($) {
        var body = $("body");
        $.get("include/header.html", function(data) {body.prepend(data);});
        $.get("include/footer.html", function(data) {body.append(data);});
    });
});

jsloader.onLoad(function () {
    "use strict";
    require(['jquery.app'], function(app) {
        app.theme.init();
    });
});

jsloader.init();
