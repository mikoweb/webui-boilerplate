/**
 * @module app/view/content/editor
 */
define('app/view/content/editor', ['jquery', 'marionette', 'nunjucks',
    'text!template/content/editor.njk.html', 'tinymce.helper', 'jquery.app', 'tinymce.jquery'],
function ($, Marionette, Nunjucks, template, helper, app) {
    "use strict";

    return Marionette.View.extend({
        tagName: 'section',
        ui: {
            editor: '.editor'
        },
        template: function () {
            return $(Nunjucks.renderString(template));
        },
        onDomRefresh: function () {
            helper.initEditor(this.ui.editor, $.extend(helper.getConfig("advanced"), {
                "language": "pl",
                "content_css": app.get("path_webui_engine") + "/css/bootstrap.min.css",
                "document_base_url": app.get("path_base"),
                "relative_urls": true
                //file_browser_callback: elFinderBrowser
            }));
        }
    });
});
