/**
 * @module app/view/content/sortable
 */
define('app/view/content/sortable', ['jquery', 'marionette', 'nunjucks',
    'text!template/content/sortable.njk.html', 'tinysort', 'jquery.sortable'],
function ($, Marionette, Nunjucks, template, tinysort) {
    "use strict";

    return Marionette.View.extend({
        tagName: 'section',
        ui: {
            sortable: 'ul.sortable-test',
            sortableTinysort: '.sortable-and-tinysort'
        },
        template: function () {
            return $(Nunjucks.renderString(template));
        },
        sort: function () {
            var options = {
                selector: 'span',
                order: 'desc'
            };

            tinysort(this.ui.sortableTinysort.find('> li'), options);
            this.ui.sortableTinysort.find('ul').each(function () {
                tinysort($(this).find('> li'), options);
            });
        },
        onDomRefresh: function () {
            var view = this;
            this.ui.sortable.sortable();
            this.sort();
            this.ui.sortableTinysort.sortable({
                onDrop: function ($item, container, parent) {
                    parent($item, container);
                    view.sort();
                }
            });
        }
    });
});
