/**
 * @module app/view/content/forms
 */
define('app/view/content/forms', ['jquery', 'marionette', 'nunjucks',
    'text!template/content/forms.njk.html', 'select2', 'webui-cssloader'],
function ($, Marionette, Nunjucks, template, Select2, loader) {
    "use strict";

    return Marionette.ItemView.extend({
        tagName: 'section',
        ui: {
            form: '.form'
        },
        events: {
            'submit @ui.form': 'onFormSubmit'
        },
        template: function () {
            return $(Nunjucks.renderString(template));
        },
        /**
         * @param {Event} e
         */
        onFormSubmit: function (e) {
            e.preventDefault();
        },
        onShow: function () {
            var view = this;

            loader.inject('@select2', function () {
                view.$el.find('.select').select2();
                view.$el.find('.select_tags').select2({
                    tags: true,
                    tokenSeparators: [',']
                });
            });
        }
    });
});
