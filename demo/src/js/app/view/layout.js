import $ from 'jquery';
import Marionette from 'marionette';
import Nunjucks from 'nunjucks';
import template from 'text!template/base.njk.html';
import MenuCollection from 'app/collection/menu';
import MenuView from 'app/view/header/menu';

export default class LayoutView extends Marionette.View {
    initialize() {
        const content = this.getRegion('content');
        this.once('render', this.removePreloader);
        content.on('show', this._onContentShow);
        content.on('empty', this._onContentEmpty);
    }
    regions() {
        return {
            menu: "#menu",
            footer: "#footer",
            content: '#content'
        }
    }
    template() {
        return $(Nunjucks.renderString(template));
    }
    removePreloader() {
        this.$el
            .removeClass('body--preloader')
            .css('opacity', 0)
            .animate({
                opacity: 1
            }, 500)
        ;
    }
    /**
     * @param {Marionette.AppRouter} [router]
     */
    showMenu(router) {
        const region = this.getRegion('menu');
        const menu = new MenuCollection();
        const view = new MenuView({
            collection: menu
        });

        menu.fetch();
        region.show(view);

        if (router) {
            router.on('route', function () {
                view.render();
            });
        }
    }
    /**
     * @private
     */
    _onContentShow() {
        this.$el.removeClass('container--preloader');
    }
    /**
     * @private
     */
    _onContentEmpty() {
        this.$el.addClass('container--preloader');
    }
}
