require(['jquery', 'tinysort', 'jquery.sortable'], function ($, tinysort) {
    "use strict";

    $('ul.sortable-test').sortable();

    var elToSort = $('.sortable-and-tinysort');

    function sort() {
        var options = {
            selector: 'span',
            order: 'desc'
        };

        tinysort(elToSort.find('> li'), options);
        elToSort.find('ul').each(function () {
            tinysort($(this).find('> li'), options);
        });
    }

    sort();

    elToSort.sortable({
        onDrop: function ($item, container, parent, event) {
            parent($item);
            sort();
        }
    });
});
