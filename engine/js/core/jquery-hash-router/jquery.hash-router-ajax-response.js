/**
 * jQuery Hash Router: AjaxResponse
 * Prototyp ajaxowej odpowiedzi
 *
 * @url https://github.com/mikoweb/jQuery_Hash_Router
 * @package jquery.hash-router
 * @subpackage ajax-response
 * @author Rafał Mikołajun <rafal@vision-web.pl>
 * @copyright 2014 Rafał Mikołajun
 * @license GPL v2
 */

(function ($) {
    "use strict";

    // $.hashRouter.AjaxResponse
    Object.defineProperty($.hashRouter, "AjaxResponse", {
        value: Object.create($.hashRouter.Response)
    });

    // $.hashRouter.AjaxResponse.create
    Object.defineProperty($.hashRouter.AjaxResponse, "create", {
        /**
         * Tworzy nową instancje prototypu
         * @param {Object} setup
         */
        value: function(setup) {
            var response = Object.getPrototypeOf(this).create(setup, Object.create(this));

            if (typeof setup !== 'object') {
                setup = {};
            }

            Object.defineProperty(response, "url", {
                value: ((typeof setup.url === 'string' || setup.url instanceof Function) ? setup.url : '')
            });

            Object.defineProperty(response, "loadingDelay", {
                value: (setup.loadingDelay !== undefined ? setup.loadingDelay : 100)
            });

            Object.defineProperty(response, "cache", {
                value: (setup.cache !== undefined ? setup.cache : true)
            });

            Object.defineProperty(response, "dataType", {
                value: setup.dataType
            });

            Object.defineProperty(response, "contentType", {
                value: setup.contentType
            });

            Object.defineProperty(response, "timeout", {
                value: setup.timeout
            });

            Object.defineProperty(response, "type", {
                value: setup.type
            });

            Object.defineProperty(response, "data", {
                value: setup.data
            });

            return response;
        }
    });

    // $.hashRouter.AjaxResponse.capture
    Object.defineProperty($.hashRouter.AjaxResponse, "capture", {
        /**
         * Przechwytywanie
         * @param {$.hashRouter.event} event
         * @param {Object} properties
         */
        value: function(event, properties) {
            (function(that) {
                var args, i, j, url;

                url = that.url instanceof Function ? that.url() : that.url;
                args = [url];

                // budowanie tablicy argumentów funkcji sprintf
                for (i=0; i<properties.args.length; i++) {
                    for (j=0; j<properties.args[i].length; j++) {
                        args.push(properties.args[i][j]);
                    }
                }

                $.ajax({
                    url: $.sprintf.apply(null, args),
                    cache: that.cache instanceof Function ? that.cache() : that.cache,
                    dataType: that.dataType instanceof Function ? that.dataType() : that.dataType,
                    contentType: that.contentType instanceof Function ? that.contentType() : that.contentType,
                    timeout: that.timeout instanceof Function ? that.timeout() : that.timeout,
                    type: that.type instanceof Function ? that.type() : that.type,
                    data: that.data instanceof Function ? that.data() : that.data,
                    success: function(data) {
                        setTimeout(function() {
                            that.container.removeClass('loading');
                            event.action(that.container, properties, data);
                        }, that.loadingDelay);
                    },
                    beforeSend: function() {
                        that.container
                            .removeClass('error')
                            .addClass('loading');
                        event.before(that.container, properties);
                    },
                    complete: function(request, status) {
                        event.after(that.container, properties, status);
                    },
                    error: function(request, status, error) {
                        setTimeout(function() {
                            that.container
                                .removeClass('loading')
                                .addClass('error');
                            event.error({
                                request: request,
                                status: status,
                                error: error
                            }, that.container, properties);
                        }, that.loadingDelay);
                    }
                });
            }(this));
        }
    });
}(jQuery));
