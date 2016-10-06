import Marionette from 'marionette';
import ItemView from 'app/view/header/menu-item';
import _ from 'underscore';

export default class MenuView extends Marionette.CollectionView {
    constructor(options) {
        super(_.defaults(options, {
            childView: ItemView
        }));
    }
}
