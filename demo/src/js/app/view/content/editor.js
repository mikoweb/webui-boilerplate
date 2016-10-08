import Marionette from 'marionette';
import $ from 'jquery';
import Nunjucks from 'nunjucks';
import template from 'text!template/content/editor.njk.html';
import helper from 'tinymce.helper';
import app from 'jquery.app';
import 'tinymce.jquery';

export default class EditorView extends Marionette.View {
    tagName = 'section';
    ui = {
        editor: '.editor'
    };
    template() {
        return $(Nunjucks.renderString(template));
    }
    onDomRefresh() {
        helper.initEditor(this.ui.editor, $.extend(helper.getConfig("advanced"), {
            "language": "pl",
            "content_css": app.get("path_webui_engine") + "/css/bootstrap.min.css",
            "document_base_url": app.get("path_base"),
            "relative_urls": true
        }));
    }
}
