import Marionette from 'marionette';
import $ from 'jquery';
import Nunjucks from 'nunjucks';
import template from 'text!template/content/index.njk.html';

export default class IndexView extends Marionette.View {
    tagName = 'section'
    template() {
        return $(Nunjucks.renderString(template));
    }
}
