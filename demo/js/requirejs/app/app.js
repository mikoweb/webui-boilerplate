/**
 * @module app/app
 */
define('app/app', ['marionette', 'backbone', 'app/view/layout', 'app/controller/page'],
function (Marionette, Backbone, LayoutView, pageController) {
    "use strict";

    var app, App = Marionette.Application.extend({
        layout: null,
        pageRouter: null,
        initialize: function () {
            this.pageRouter = new Marionette.AppRouter({
                controller: pageController,
                appRoutes: {
                    'page/index': 'index',
                    'page/editor': 'editor',
                    'page/forms': 'forms',
                    'page/charts': 'charts',
                    'page/sortable': 'sortable'
                }
            });
        },
        /**
         * @returns {module:app/view/layout}
         */
        getLayout: function () {
            if (this.layout === null) {
                throw new Error('Layout is not initialized');
            }

            return this.layout;
        },
        /**
         * @param {Marionette.View} [contentView]
         */
        initLayout: function (contentView) {
            if (this.layout !== null) {
                throw new Error('Layout is already initialized');
            }

            var content;
            this.layout = new LayoutView();
            this.layout.render();
            content = this.layout.getRegion('content');

            if (contentView) {
                content.show(contentView);
            }

            this.layout.showMenu(this.pageRouter);
        }
    });

    app = new App();

    app.on('start', function() {
        Backbone.history.start();
    });

    return app;
});
