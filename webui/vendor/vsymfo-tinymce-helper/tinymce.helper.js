(function () {
    "use strict";

    var helper = {},
        configuration = {};

    /**
     * Predefiniowane ustawienia edytora
     */
    Object.defineProperties(configuration, {
        "simple": {
            value: {
                "formats": {
                    "alignleft": {
                        "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                        "classes":"text-left"
                    },
                    "aligncenter": {
                        "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                        "classes":"text-center"
                    },
                    "alignright": {
                        "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                        "classes":"text-right"
                    }
                }
            }
        },
        "advanced": {
            value: {
                "resize": true,
                "plugins": [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                    "searchreplace wordcount visualblocks visualchars code codemirror fullscreen",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "template paste textcolor"
                ],
                "toolbar1": "preview | undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
                "toolbar2": "anchor link image media | fontsizeselect | forecolor backcolor | code | template",
                "image_advtab": true,
                "fontsize_formats": "0.5em 0.6em 0.7em 0.8em 0.9em 1em 1.1em 1.2em 1.3em 1.4em 1.5em 1.6em 1.7em 1.8em 1.9em 2em 2.2em 2.4em 2.6em 2.8em 3em",
                "formats": {
                    "alignleft": {
                        "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                        "classes":"text-left"
                    },
                    "aligncenter": {
                        "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                        "classes":"text-center"
                    },"alignright": {
                        "selector": "p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",
                        "classes":"text-right"
                    }
                },
                "templates": [
                    {
                        "title":"-----------------------------------------",
                        "description": "http:\/\/getbootstrap.com\/","content":""
                    },
                    {
                        "title": "Addresses",
                        "description": "http:\/\/getbootstrap.com\/css\/#type-addresses",
                        "content": "<address><strong>Twitter, Inc.<\/strong><br \/>795 Folsom Ave, Suite 600<br \/>San Francisco, CA 94107<br \/><abbr title=Phone>P:<\/abbr> (123) 456-7890<\/address><address><strong>Full Name<\/strong><br \/><a href=mailto:#>first.last@example.com<\/a><\/address>"
                    },
                    {
                        "title": "Table",
                        "description": "http:\/\/getbootstrap.com\/css\/#tables",
                        "content": "<table class=table><thead><tr><th>#<\/th><th>First Name<\/th><th>Last Name<\/th><th>Username<\/th><\/tr><\/thead><tbody><tr><td>1<\/td><td>Mark<\/td><td>Otto<\/td><td>@mdo<\/td><\/tr><tr><td>2<\/td><td>Jacob<\/td><td>Thornton<\/td><td>@fat<\/td><\/tr><tr><td>3<\/td><td colspan=2>Larry the Bird<\/td><td>@twitter<\/td><\/tr><\/tbody><\/table>"
                    },
                    {
                        "title": "Floating",
                        "description": "http:\/\/getbootstrap.com\/css\/#helper-classes",
                        "content": "<div class=clearfix><div class=pull-left>Float Left<\/div><div class=pull-right>Float Right<\/div><\/div>"
                    },
                    {
                        "title": "Simple Grid",
                        "description": "http:\/\/getbootstrap.com\/css\/#grid",
                        "content": "<div class=container><div class=row><div class=col-xs-4>.col-xs-4<\/div><div class=col-xs-4>.col-xs-4<\/div><div class=col-xs-4>.col-xs-4<\/div><\/div><\/div>"
                    }
                ]
            }
        }
    });

    /**
     * Predefiniowane ustawienia edytora
     */
    Object.defineProperties(helper, {
        /**
         * Pobierz predefiniowany obiekt konfiguracyjny
         * @param {string} name
         * @return {Object}
         */
        "getConfig": {
            value: function (name) {
                if (configuration[name] !== undefined) {
                    return jQuery.extend(true, {}, configuration[name]);
                }

                return {};
            }
        },
        /**
         * Pobierz predefiniowany obiekt konfiguracyjny
         * @param {jQuery} selector
         * @param {Object} config
         */
        "initEditor": {
            value: function (selector, config) {
                selector.tinymce(config);
            }
        }
    });

    define("tinymce.helper", ['tinymce.jquery'], function () {
        return helper;
    });
}());
