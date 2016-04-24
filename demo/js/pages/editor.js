require(['jquery', 'jquery.app', 'tinymce.helper'], function ($, app, helper) {
    "use strict";

    var editor = $("#tinymceExample");

    helper.initEditor(editor, $.extend(helper.getConfig("advanced"), {
        "language": "pl",
        "content_css": "../../../engine/css/bootstrap.min.css",
        "document_base_url": app.get("path_base"),
        "relative_urls": true
        //file_browser_callback: elFinderBrowser
    }));
});
