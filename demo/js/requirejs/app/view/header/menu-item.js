/**
 * @module app/view/header/menu-item
 */
define('app/view/header/menu-item', ['backbone', 'marionette', 'jquery', 'nunjucks',
    'text!template/header/menu-item.njk.html'],
function (Backbone, Marionette, $, Nunjucks, template) {
    "use strict";

    return Marionette.ItemView.extend({
        tagName: 'li',
        className: 'nav-item',
        modelEvents: {
            'change': 'modelChanged'
        },
        template: function (data) {
            return $(Nunjucks.renderString(template, data));
        },
        modelChanged: function () {
            this.render();
        },
        onRender: function () {
            var url = Backbone.history.getFragment();
            this.$el.find('.' + this.className).removeClass('active');
            if (url) {
                this.$el.find('a[href="#' + url + '"]').parent().addClass('active');
            } else {
                this.$el.find('a[data-default="true"]').parent().addClass('active');
            }
        }
    });
});
