/**
 * @module app/collection/menu
 */
define('app/collection/menu', ['backbone', 'jquery.app', 'app/model/menu-item'],
function (Backbone, jqueryApp, ItemModel) {
    "use strict";

    return Backbone.Collection.extend({
        url: jqueryApp.get('path_base') + 'demo/menu.json',
        model: ItemModel
    });
});
