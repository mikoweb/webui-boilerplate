/**
 * @module app/view/content/index
 */
define('app/view/content/index', ['jquery', 'marionette', 'nunjucks',
    'text!template/content/index.njk.html'],
function ($, Marionette, Nunjucks, template) {
    "use strict";

    return Marionette.View.extend({
        tagName: 'section',
        template: function () {
            return $(Nunjucks.renderString(template));
        }
    });
});
