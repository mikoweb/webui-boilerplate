/**
 * @module app/view/layout
 */
define('app/view/layout', ['jquery', 'marionette', 'nunjucks', 'text!template/base.njk.html',
    'app/collection/menu', 'app/view/header/menu'],
function ($, Marionette, Nunjucks, template, MenuCollection, MenuView) {
    "use strict";

    return Marionette.View.extend({
        el: $('body'),
        regions: {
            header: "#header",
            footer: "#footer",
            content: '#content'
        },
        template: function () {
            return $(Nunjucks.renderString(template));
        },
        initialize: function () {
            var content = this.getRegion('content');
            this.once('render', this.removePreloader);
            content.on('show', this.onContentShow);
            content.on('empty', this.onContentEmpty);
        },
        removePreloader: function () {
            this.$el
                .removeClass('body--preloader')
                .css('opacity', 0)
                .animate({
                    opacity: 1
                }, 500)
            ;
        },
        /**
         * @param {Marionette.AppRouter} [router]
         */
        showMenu: function (router) {
            var menu, view,
                header = this.getRegion('header');

            menu = new MenuCollection();
            view = new MenuView({
                collection: menu
            });

            menu.fetch();
            header.show(view);

            if (router) {
                router.on('route', function () {
                    view.render();
                });
            }
        },
        onContentShow: function () {
            this.$el.removeClass('container--preloader');
        },
        onContentEmpty: function () {
            this.$el.addClass('container--preloader');
        }
    });
});
