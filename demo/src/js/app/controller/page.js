/**
 * @param {string} viewName
 * @param {Object} [options]
 */
function showView (viewName, options) {
    require([viewName, 'app/app'], function (View, app) {
        app.default.getLayout().getRegion('content').show(new View.default(options));
    });
}

export default class PageController {
    index() {
        showView('app/view/content/index');
    }
    forms() {
        showView('app/view/content/forms');
    }
    charts() {
        showView('app/view/content/charts');
    }
    sortable() {
        showView('app/view/content/sortable');
    }
}
