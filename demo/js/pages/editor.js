require(['jquery', 'jquery.app'], function ($, app) {
    "use strict";

    app.theme.ready(function() {
        var editor = $("#tinymceExample");

        require(['tinymce.helper'], function (helper) {
            helper.initEditor(editor, $.extend(helper.getConfig("advanced"), {
                "language": "pl",
                "content_css": "../../../engine/less/build.css",
                "document_base_url": app.get("path_base"),
                "relative_urls": true
                //file_browser_callback: elFinderBrowser
            }));
        });
    });
});
