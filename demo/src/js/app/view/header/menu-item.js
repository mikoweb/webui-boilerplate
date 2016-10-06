import Backbone from 'backbone';
import Marionette from 'marionette';
import $ from 'jquery';
import Nunjucks from 'nunjucks';
import template from 'text!template/header/menu-item.njk.html';
import _ from 'underscore';

export default class MenuItemView extends Marionette.View {
    constructor(options) {
        super(_.defaults(options, {
            tagName: 'li',
            className: 'nav-item'
        }));
    }
    template(data) {
        return $(Nunjucks.renderString(template, data));
    }
    onRender() {
        let url = Backbone.history.getFragment();
        this.$el.find('.' + this.className).removeClass('active');
        if (url) {
            this.$el.find('a[href="#' + url + '"]').parent().addClass('active');
        } else {
            this.$el.find('a[data-default="true"]').parent().addClass('active');
        }
    }
}
