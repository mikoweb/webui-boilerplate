require(['jquery', 'jquery.app', 'selectize', 'webui-cssloader'], function ($, app, Selectize, loader) {
    "use strict";

    loader.inject('@selectize', function () {
        $("#selectize1, #selectize2, #selectize3, #selectize4, #selectize5").selectize({
            copyClassesToDropdown: false,
            allowEmptyOption: true
        });

        $('#input-tags').selectize({
            delimiter: ',',
            persist: false,
            create: function(input) {
                return {
                    value: input,
                    text: input
                };
            }
        });

        $('#select-gear').selectize({
            //sortField: 'text',
            copyClassesToDropdown: false,
            allowEmptyOption: true
        });
    });
});
