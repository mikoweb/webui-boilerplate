/**
 * https://github.com/Modernizr/Modernizr/tree/master/feature-detects/es5
 * http://kangax.github.io/es5-compat-table/
 */
(function (Modernizr) {
    "use strict";

    Modernizr.addTest('es5array', function () {
        return !!(Array.prototype &&
            Array.prototype.every &&
            Array.prototype.filter &&
            Array.prototype.forEach &&
            Array.prototype.indexOf &&
            Array.prototype.lastIndexOf &&
            Array.prototype.map &&
            Array.prototype.some &&
            Array.prototype.reduce &&
            Array.prototype.reduceRight &&
            Array.isArray);
    });

    Modernizr.addTest('es5date', function () {
        var isoDate = '2013-04-12T06:06:37.307Z',
            canParseISODate = false;
        try {
            canParseISODate = !!Date.parse(isoDate);
        } catch (e) {
            // no ISO date parsing yet
        }
        return !!(Date.now &&
            Date.prototype &&
            Date.prototype.toISOString &&
            Date.prototype.toJSON &&
            canParseISODate);
    });

    Modernizr.addTest('es5function', function () {
        return !!(Function.prototype && Function.prototype.bind);
    });

    Modernizr.addTest('es5object', function () {
        return !!(Object.keys &&
            Object.create &&
            Object.getPrototypeOf &&
            Object.getOwnPropertyNames &&
            Object.isSealed &&
            Object.isFrozen &&
            Object.isExtensible &&
            Object.getOwnPropertyDescriptor &&
            Object.defineProperty &&
            Object.defineProperties &&
            Object.seal &&
            Object.freeze &&
            Object.preventExtensions);
    });

    Modernizr.addTest('strictmode', (function(){'use strict'; return !this; })());

    Modernizr.addTest('es5string', function () {
        return !!(String.prototype && String.prototype.trim);
    });
}(Modernizr));