import Marionette from 'marionette';
import Backbone from 'backbone';
import LayoutView from 'app/view/layout';
import PageController from 'app/controller/page';

class App extends Marionette.Application {
    initialize() {
        this.layout = null;
        this.pageRouter = new Marionette.AppRouter({
            controller: new PageController,
            appRoutes: {
                'page/index': 'index',
                'page/editor': 'editor',
                'page/forms': 'forms',
                'page/charts': 'charts',
                'page/sortable': 'sortable'
            }
        });
    }
    /**
     * @returns {LayoutView}
     */
    getLayout() {
        if (this.layout === null) {
            throw new Error('Layout is not initialized');
        }

        return this.layout;
    }
    /**
     * @param {Marionette.View} [contentView]
     */
    initLayout(contentView) {
        if (this.layout !== null) {
            throw new Error('Layout is already initialized');
        }

        let content;
        this.layout = new LayoutView({
            el: $('body')
        });
        this.layout.render();
        content = this.layout.getRegion('content');

        if (contentView) {
            content.show(contentView);
        }

        this.layout.showMenu(this.pageRouter);
    }
}

let app = new App();
app.on('start', function() {
    Backbone.history.start();
});

export default app;
