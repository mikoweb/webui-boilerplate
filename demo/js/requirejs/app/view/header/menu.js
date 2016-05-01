/**
 * @module app/view/header/menu
 */
define('app/view/header/menu', ['marionette', 'jquery', 'nunjucks', 'app/view/header/menu-item',
    'text!template/header/menu.njk.html'],
function (Marionette, $, Nunjucks, ItemView, template) {
    "use strict";

    return Marionette.CompositeView.extend({
        childViewContainer: '.navbar-nav',
        childView: ItemView,
        tagName: 'nav',
        className: 'navbar navbar-light bg-faded',
        template: function () {
            return $(Nunjucks.renderString(template));
        }
    });
});
