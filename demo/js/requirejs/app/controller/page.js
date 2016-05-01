/**
 * @module app/controller/page
 */
define('app/controller/page', function () {
    "use strict";
    return {
        index: function () {
            this._showView('app/view/content/index');
        },
        editor: function () {
            this._showView('app/view/content/editor');
        },
        forms: function () {
            this._showView('app/view/content/forms');
        },
        charts: function () {
            this._showView('app/view/content/charts');
        },
        sortable: function () {
            this._showView('app/view/content/sortable');
        },
        /**
         * @param {string} viewName
         * @param {Object} [options]
         * @private
         */
        _showView: function (viewName, options) {
            require([viewName, 'app/app'], function (View, app) {
                app.getLayout().getRegion('content').show(new View(options));
            });
        }
    };
});
