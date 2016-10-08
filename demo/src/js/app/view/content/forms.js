import Marionette from 'marionette';
import $ from 'jquery';
import Nunjucks from 'nunjucks';
import template from 'text!template/content/forms.njk.html';
import 'select2';
import loader from 'webui-cssloader';

export default class FormsView extends Marionette.View {
    tagName = 'section';
    ui = {
        form: '.form'
    };
    events = {
        'submit @ui.form': '_onFormSubmit'
    };
    template() {
        return $(Nunjucks.renderString(template));
    }
    onDomRefresh() {
        const view = this;
        loader.inject('@select2', function () {
            view.$el.find('.select').select2();
            view.$el.find('.select_tags').select2({
                tags: true,
                tokenSeparators: [',']
            });
        });
    }
    /**
     * @param {Event} e
     * @private
     */
    _onFormSubmit(e) {
        e.preventDefault();
    }
}
