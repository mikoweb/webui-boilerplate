require(['jquery', 'jquery.app', 'select2', 'webui-cssloader'], function ($, app, Select2, loader) {
    "use strict";

    $.fn.select2.defaults.set('theme', 'default');

    loader.inject('@select2', function () {
        $("#select2_1, #select2_2, #select2_3, #select2_4, #select2_5").select2();

        $('#input-tags').select2({
            tags: true,
            tokenSeparators: [','],
        });

        $('#select-gear').select2();
    });
});
