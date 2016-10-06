import Marionette from 'marionette';
import $ from 'jquery';
import Nunjucks from 'nunjucks';
import template from 'text!template/content/sortable.njk.html';
import tinysort from 'tinysort';
import sortable from 'jquery.sortable';

export default class SortableView extends Marionette.View {
    tagName = 'section';
    ui = {
        sortable: 'ul.sortable-test',
        sortableTinysort: '.sortable-and-tinysort'
    };
    template() {
        return $(Nunjucks.renderString(template));
    }
    sort() {
        const options = {
            selector: 'span',
            order: 'desc'
        };

        tinysort(this.ui.sortableTinysort.find('> li'), options);
        this.ui.sortableTinysort.find('ul').each(function () {
            tinysort($(this).find('> li'), options);
        });
    }
    onDomRefresh() {
        let view = this;
        this.ui.sortable.sortable();
        this.sort();
        this.ui.sortableTinysort.sortable({
            onDrop: function ($item, container, parent) {
                parent($item, container);
                view.sort();
            }
        });
    }
}
