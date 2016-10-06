import Backbone from 'backbone';
import MenuItemModel from 'app/model/menu-item';
import jqueryApp from 'jquery.app';

export default class MenuCollection extends Backbone.Collection {
    url = jqueryApp.get('path_base') + 'demo/menu.json';
    model = MenuItemModel;
}
