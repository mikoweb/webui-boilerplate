jQuery(function($) {
    "use strict";

    // Placeholder
    $('input, textarea').placeholder();

    // Walidacja formularzy: http://ericleads.com/h5validate/
    $('form').h5Validate({
        errorClass: 'invalid'
    });

    // details summary polyfill
    $('details').details();

    // Tooltip w polach formularza
    $('input, textarea, select').tooltip({
        trigger: 'focus',
        container: 'body',
        delay: { show: 100, hide: 500 }
    });
    $('label').tooltip({
        trigger: 'hover',
        container: 'body',
        delay: { show: 100, hide: 100 }
    });
    $('.input-group').tooltip({
        trigger: 'hover',
        container: 'body',
        delay: { show: 100, hide: 100 }
    });
});
