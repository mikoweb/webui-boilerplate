/*
 * jQuery sprintf - perl based functionallity for sprintf and friends.
 *
 * Copyright © 2008 Carl Fürstenberg
 *
 * Released under GPL, BSD, or MIT license.
 * ---------------------------------------------------------------------------
 *  GPL:
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright (c) The Regents of the University of California.
 * All rights reserved.
 *
 * ---------------------------------------------------------------------------
 *  BSD:
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the University nor the names of its contributors
 *    may be used to endorse or promote products derived from this software
 *    without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 °* OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 * ---------------------------------------------------------------------------
 *  MIT:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * ---------------------------------------------------------------------------
 *
 *  Version: 0.0.6
 */

/**
 * Inserts the arguments into the format and returns the formated string
 *
 * @example alert($.vsprintf( "%s %s", [ "Hello", "world" ] ));
 *
 * @param String format the format to use
 * @param Array args the arguments to insert into the format
 * @return String the formated string
 */
jQuery.vsprintf = function jQuery_vsprintf( format, args ) {
	if( format == null ) {
		throw "Not enough arguments for vsprintf";
	}
	if( args == null ) {
		args = [];
	}

	function _sprintf_format( type, value, flags ) {

		// Similar to how perl printf works
		if( value == undefined ) {
			if( type == 's' ) {
				return '';
			} else {
				return '0';
			}
		}

		var result;
		var prefix = '';
		var fill = '';
		var fillchar = ' ';
		if( flags['short'] || flags['long'] || flags['long_long'] ) {
			/* This is pretty ugly, but as JS ignores bit lengths except
			 * somewhat when working with bit operators.
			 * So we fake a bit :) */
			switch( type ) {
			case 'e':
			case 'f':
			case 'G':
			case 'E':
			case 'G':
			case 'd': /* signed */
				if( flags['short'] ) {
					if( value >= 32767 ) {
						value = 32767;
					} else if( value <= -32767-1 ) {
						value = -32767-1;
					}
				} else if ( flags['long'] ) {
					if( value >= 2147483647 ) {
						value = 2147483647;
					} else if( value <= -2147483647-1 ) {
						value = -2147483647-1;
					}
				} else /*if ( flags['long_long'] )*/ {
					if( value >= 9223372036854775807 ) {
						value = 9223372036854775807;
					} else if( value <= -9223372036854775807-1 ) {
						value = -9223372036854775807-1;
					}
				}
				break;
			case 'X':
			case 'B':
			case 'u':
			case 'o':
			case 'x':
			case 'b': /* unsigned */
				if( value < 0 ) {
					/* Pretty ugly, but one only solution */
					value = Math.abs( value ) - 1;
				}
				if( flags['short'] ) {
					if( value >= 65535 ) {
						value = 65535;
					}
				} else if ( flags['long'] ) {
					if( value >= 4294967295 ) {
						value = 4294967295;
					}

				} else /*if ( flags['long_long'] )*/ {
					if( value >= 18446744073709551615 ) {
						value = 18446744073709551615;
					}

				}
				break;
			}
		}
		switch( type ) {
		case 'c':
			result = String.fromCharCode( parseInt( value ) );
			break;
		case 's':
			result = value.toString();
			break;
		case 'd':
			result = (new Number( parseInt( value ) ) ).toString();
			break;
		case 'u':
			result = (new Number( parseInt( value ) ) ).toString();
			break;
		case 'o':
			result = (new Number( parseInt( value ) ) ).toString(8);
			break;
		case 'x':
			result = (new Number( parseInt( value ) ) ).toString(16);
			break;
		case 'B':
		case 'b':
			result = (new Number( parseInt( value ) ) ).toString(2);
			break;
		case 'e':
			var digits = flags['precision'] ? flags['precision'] : 6;
			result = (new Number( value ) ).toExponential( digits ).toString();
			break;
		case 'f':
			var digits = flags['precision'] ? flags['precision'] : 6;
			result = (new Number( value ) ).toFixed( digits ).toString();
			break;
		case 'g':
			var digits = flags['precision'] ? flags['precision'] : 6;
			result = (new Number( value ) ).toPrecision( digits ).toString();
			break;
		case 'X':
			result = (new Number( parseInt( value ) ) ).toString(16).toUpperCase();
			break;
		case 'E':
			var digits = flags['precision'] ? flags['precision'] : 6;
			result = (new Number( value ) ).toExponential( digits ).toString().toUpperCase();
			break;
		case 'G':
			var digits = flags['precision'] ? flags['precision'] : 6;
			result = (new Number( value ) ).toPrecision( digits ).toString().toUpperCase();
			break;
		}

		if(flags['+'] && parseFloat( value ) > 0 && ['d','e','f','g','E','G'].indexOf(type) != -1 ) {
			prefix = '+';
		}

		if(flags[' '] && parseFloat( value ) > 0 && ['d','e','f','g','E','G'].indexOf(type) != -1 ) {
			prefix = ' ';
		}

		if( flags['#'] && parseInt( value ) != 0 ) {
			switch(type) {
			case 'o':
				prefix = '0';
				break;
			case 'x':
			case 'X':
				prefix = '0x';
				break;
			case 'b':
				prefix = '0b';
				break;
			case 'B':
				prefix = '0B';
				break;
			}
		}

		if( flags['0'] && !flags['-'] ) {
			fillchar = '0';
		}

		if( flags['width'] && flags['width'] > ( result.length + prefix.length ) ) {
			var tofill = flags['width'] - result.length - prefix.length;
			for( var i = 0; i < tofill; ++i ) {
				fill += fillchar;
			}
		}

		if( flags['-'] && !flags['0'] ) {
			result += fill;
		} else {
			result = fill + result;
		}

		return prefix + result;
	};

	var result = "";

	var index = 0;
	var current_index = 0;
	var flags = {
		'long': false,
		'short': false,
		'long_long': false
	};
	var in_operator = false;
	var relative = false;
	var precision = false;
	var fixed = false;
	var vector = false;
	var bitwidth = false;
	var vector_delimiter = '.';

	for( var i = 0; i < format.length; ++i ) {
		var current_char = format.charAt(i);
		if( in_operator ) {
			// backward compat
			switch( current_char ) {
			case 'i':
				current_char = 'd';
				break;
			case 'D':
				flags['long'] = true;
				current_char = 'd';
				break;
			case 'U':
				flags['long'] = true;
				current_char = 'u';
				break;
			case 'O':
				flags['long'] = true;
				current_char = 'o';
				break;
			case 'F':
				current_char = 'f';
				break;
			}
			switch( current_char ) {
			case 'c':
			case 's':
			case 'd':
			case 'u':
			case 'o':
			case 'x':
			case 'e':
			case 'f':
			case 'g':
			case 'X':
			case 'E':
			case 'G':
			case 'b':
			case 'B':
				var value = args[current_index];
				if( vector ) {
					var fixed_value = value;
					if( value instanceof Array ) {
						// if the value is an array, assume to work on it directly
						fixed_value = value;
					} else if ( typeof(value) == 'string' || value instanceof String ) {
						// normal behavour, assume string is a bitmap
						fixed_value = value.split('').map( function( value ) { return value.charCodeAt(); } );
					} else if ( ( typeof(value) == 'number' || value instanceof Number ) && flags['bitwidth'] ) {
						// if we defined a width, assume we want to vectorize the bits directly
						fixed_value = [];
						do {
							fixed_value.unshift( value & ~(~0 << flags['bitwidth'] ) );
						} while( value >>>= flags['bitwidth'] );
					} else {
						fixed_value = value.toString().split('').map( function( value ) { return value.charCodeAt(); } );

					}
					result += fixed_value.map( function( value ) {
							return _sprintf_format( current_char, value, flags );
						}).join( vector_delimiter );
				} else {
					result += _sprintf_format( current_char, value, flags );
				}
				if( !fixed ) {
					++index;
				}
				current_index = index;
				flags = {};
				relative = false;
				in_operator = false;
				precision = false;
				fixed = false;
				vector = false;
				bitwidth = false;
				vector_delimiter = '.';
				break;
			case 'v':
				vector = true;
				break;
			case ' ':
			case '0':
			case '-':
			case '+':
			case '#':
				flags[current_char] = true;
				break;
			case '*':
				relative = true;
				break;
			case '.':
				precision = true;
				break;
			case '@':
				bitwidth = true;
				break;
			case 'l':
				if( flags['long'] ) {
					flags['long_long'] = true;
					flags['long'] = false;
				} else {
					flags['long'] = true;
					flags['long_long'] = false;
				}
				flags['short'] = false;
				break;
			case 'q':
			case 'L':
				flags['long_long'] = true;
				flags['long'] = false;
				flags['short'] = false;
				break;
			case 'h':
				flags['short'] = true;
				flags['long'] = false;
				flags['long_long'] = false;
				break;
			}
			if( /\d/.test( current_char ) ) {
				var num = parseInt( format.substr( i ) );
				var len = num.toString().length;
				i += len - 1;
				var next = format.charAt( i  + 1 );
				if( next == '$' ) {
					if( num < 0 || num > args.length ) {
						throw "out of bound";
					}
					if( relative ) {
						if( precision ) {
							flags['precision'] = args[num - 1];
							precision = false;
						} else if( format.charAt( i + 2 ) == 'v' ) {
							vector_delimiter = args[num - 1];
						}else {
							flags['width'] = args[num - 1];
						}
						relative = false;
					} else {
						fixed = true;
						current_index = num - 1;
					}
					++i;
				} else if( precision ) {
					flags['precision'] = num;
					precision = false;
				} else if( bitwidth ) {
					flags['bitwidth'] = num;
					bitwidth = false;
				} else {
					flags['width'] = num;
				}
			} else if ( relative && !/\d/.test( format.charAt( i + 1 ) ) ) {
				if( precision ) {
					flags['precision'] = args[current_index];
					precision = false;
				} else if( format.charAt( i + 1 ) == 'v' ) {
					vector_delimiter = args[current_index];
				} else {
					flags['width'] = args[current_index];
				}
				++index;
				if( !fixed ) {
					current_index++;
				}
				relative = false;
			}
		} else {
			if( current_char == '%' ) {
				// If the next character is an %, then we have an escaped %,
				// we'll take this as an exception to the normal lookup, as
				// we don't want/need to process this.
				if( format.charAt(i+1) == '%' ) {
					result += '%';
					++i;
					continue;
				}
				in_operator = true;
				continue;
			} else {
				result += current_char;
				continue;
			}
		}
	}
	return result;
};

/**
 * Inserts the arguments§ into the format and returns the formated string
 *
 * @example alert($.sprintf( "%s %s", "Hello", "world" ));
 *
 * @param String format the format to use
 * @param Object args... the arguments to insert into the format
 * @return String the formated string
 */

jQuery.sprintf = function jQuery_sprintf() {
	if( arguments.length == 0 ) {
		throw "Not enough arguments for sprintf";
	}

	var args = Array.prototype.slice.call(arguments);
	var format = args.shift();

	return jQuery.vsprintf( format, args );
};

/**
 * Inserts the arguments into the format and appends the formated string
 * to the objects in question.
 *
 * @example $('p').printf( "%d <strong>%s</strong>", 2, "world" );
 *
 * @before <p>Hello</p>
 *
 * @after <p>Hello2 <strong>world</strong></p>
 *
 * @param String format the format to use
 * @param Object args... the arguments to insert into the format
 */

jQuery.fn.printf = function jQuery_fn_printf() {
	if( arguments.length == 0 ) {
		throw "Not enough arguments for sprintf";
	}
	var args = Array.prototype.slice.call(arguments);
	var format = args.shift();

	return this.append( jQuery.vsprintf( format, args ) );
};

/**
 * Inserts the arguments into the format and appends the formated string
 * to the objects in question.
 *
 * @example $('p').vprintf( "%d <strong>%s</strong>", [ 2, "world" ] );
 *
 * @before <p>Hello</p>
 *
 * @after <p>Hello2 <strong>world</strong></p>
 *
 * @param String format the format to use
 * @param Array args the arguments to insert into the format
 */
jQuery.fn.vprintf = function jQuery_fn_vprintf( format, args ) {
	if( arguments.length == 0 ) {
		throw "Not enough arguments for sprintf";
	}

	return this.append( jQuery.vsprintf( format, args  ) );
};

/**
 * Formats the objects html in question and replaces the content
 * with the formated content
 *
 * @example $('p').vformat( [ "Hello", "world" ] );
 *
 * @before <p>%s %s</p>
 *
 * @after <p>Hello world</p>
 *
 * @param Array args the arguments to insert into the format
 */

jQuery.fn.vformat = function jQuery_fn_vformat( args ) {
	if( arguments.length == 0 ) {
		throw "Not enough arguments for sprintf";
	}
	return this.each( function() {
			self = jQuery(this);
			self.html(  jQuery.vsprintf( self.html(), args ) )
		}
	);
}

/**
 * Formats the objects html in question and replaces the content
 * with the formated content
 *
 * @example $('p').format( "Hello", "world" );
 *
 * @before <p>%s %s</p>
 *
 * @after <p>Hello world</p>
 *
 * @param Object args... the arguments to insert into the format
 */
jQuery.fn.format = function jQuery_fn_format() {
	if( arguments.length == 0 ) {
		throw "Not enough arguments for sprintf";
	}
	var args = Array.prototype.slice.call(arguments);
	return this.each( function() {
			self = jQuery(this);
			self.html(  jQuery.vsprintf( self.html(), args ) )
		}
	);
}

/**
 * Inserts the arguments into the format and prints formated string
 * to console or dump
 *
 * @example $.printf( "%s %s", "Hello", "world" );
 *
 * @param String format the format to use
 * @param Object args... the arguments to insert into the format
 */
jQuery.printf = function jQuery_printf() {
	if( arguments.length == 0 ) {
		throw "Not enough arguments for sprintf";
	}
	var args = Array.prototype.slice.call(arguments);
	var format = args.shift();
	var ret = jQuery.vsprintf( format, args );

	if( window.console ) {
		window.console.info( ret );
	} else {
		window.dump( ret );
	}
};
/**
 * Inserts the arguments into the format and prints formated string
 * to console or dump
 *
 * @example $.vprintf( "%s %s", [ "Hello", "world" ] );
 *
 * @param String format the format to use
 * @param Array args the arguments to insert into the format
 */
jQuery.vprintf = function jQuery_vprintf( format, args ) {
	if( arguments.length == 0 ) {
		throw "Not enough arguments for sprintf";
	}
	var ret = jQuery.vsprintf( format, args );

	if( window.console ) {
		window.console.info( ret );
	} else {
		window.dump( ret );
	}

};

/**
 * h5Validate
 * @version v0.9.0
 * Using semantic versioning: http://semver.org/
 * @author Eric Hamilton http://ericleads.com/
 * @copyright 2010 - 2012 Eric Hamilton
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Developed under the sponsorship of RootMusic, Zumba Fitness, LLC, and Rese Property Management
 */

/*global jQuery, window, console */
(function ($) {
	'use strict';
	var console = window.console || function () {},
		h5 = { // Public API
			defaults : {
				debug: false,

				RODom: false,

				// HTML5-compatible validation pattern library that can be extended and/or overriden.
				patternLibrary : { //** TODO: Test the new regex patterns. Should I apply these to the new input types?
					// **TODO: password
					phone: /([\+][0-9]{1,3}([ \.\-])?)?([\(][0-9]{1,6}[\)])?([0-9A-Za-z \.\-]{1,32})(([A-Za-z \:]{1,11})?[0-9]{1,4}?)/,

					// Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/email_address_validation/
					email: /((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?/,

					// Shamelessly lifted from Scott Gonzalez via the Bassistance Validation plugin http://projects.scottsplayground.com/iri/
					url: /(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,

					// Number, including positive, negative, and floating decimal. Credit: bassistance
					number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,

					// Date in ISO format. Credit: bassistance
					dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,

					alpha: /[a-zA-Z]+/,
					alphaNumeric: /\w+/,
					integer: /-?\d+/
				},

				// The prefix to use for dynamically-created class names.
				classPrefix: 'h5-',

				errorClass: 'ui-state-error', // No prefix for these.
				validClass: 'ui-state-valid', // "
				activeClass: 'active', // Prefix will get prepended.
				requiredClass: 'required',
				requiredAttribute: 'required',
				patternAttribute: 'pattern',

				// Attribute which stores the ID of the error container element (without the hash).
				errorAttribute: 'data-h5-errorid',

				// Events API
				customEvents: {
					'validate': true
				},

				// Setup KB event delegation.
				kbSelectors: ':input:not(:button):not(:disabled):not(.novalidate)',
				focusout: true,
				focusin: false,
				change: true,
				keyup: false,
				activeKeyup: true,

				// Setup mouse event delegation.
				mSelectors: '[type="range"]:not(:disabled):not(.novalidate), :radio:not(:disabled):not(.novalidate), :checkbox:not(:disabled):not(.novalidate), select:not(:disabled):not(.novalidate), option:not(:disabled):not(.novalidate)',
				click: true,

				// What do we name the required .data variable?
				requiredVar: 'h5-required',

				// What do we name the pattern .data variable?
				patternVar: 'h5-pattern',
				stripMarkup: true,

				// Run submit related checks and prevent form submission if any fields are invalid?
				submit: true,

				// Move focus to the first invalid field on submit?
				focusFirstInvalidElementOnSubmit: true,

				// When submitting, validate elements that haven't been validated yet?
				validateOnSubmit: true,

				// Callback stubs
				invalidCallback: function () {},
				validCallback: function () {},

				// Elements to validate with allValid (only validating visible elements)
				allValidSelectors: ':input:visible:not(:button):not(:disabled):not(.novalidate)',

				// Mark field invalid.
				// ** TODO: Highlight labels
				// ** TODO: Implement setCustomValidity as per the spec:
				// http://www.whatwg.org/specs/web-apps/current-work/multipage/association-of-controls-and-forms.html#dom-cva-setcustomvalidity
				markInvalid: function markInvalid(options) {
					var $element = $(options.element),
						$errorID = $(options.errorID);
					$element.addClass(options.errorClass).removeClass(options.validClass);

					// User needs help. Enable active validation.
					$element.addClass(options.settings.activeClass);

					if ($errorID.length) { // These ifs are technically not needed, but improve server-side performance 
						if ($element.attr('title')) {
							$errorID.text($element.attr('title'));
						}
						$errorID.show();
					}
					$element.data('valid', false);
					options.settings.invalidCallback.call(options.element, options.validity);
					return $element;
				},

				// Mark field valid.
				markValid: function markValid(options) {
					var $element = $(options.element),
						$errorID = $(options.errorID);

					$element.addClass(options.validClass).removeClass(options.errorClass);
					if ($errorID.length) {
						$errorID.hide();
					}
					$element.data('valid', true);
					options.settings.validCallback.call(options.element, options.validity);
					return $element;
				},

				// Unmark field
				unmark: function unmark(options) {
					var $element = $(options.element);
					$element.removeClass(options.errorClass).removeClass(options.validClass);
					$element.form.find("#" + options.element.id).removeClass(options.errorClass).removeClass(options.validClass);
					return $element;
				}
			}
		},

		// Aliases
		defaults = h5.defaults,
		patternLibrary = defaults.patternLibrary,

		createValidity = function createValidity(validity) {
			return $.extend({
				customError: validity.customError || false,
				patternMismatch: validity.patternMismatch || false,
				rangeOverflow: validity.rangeOverflow || false,
				rangeUnderflow: validity.rangeUnderflow || false,
				stepMismatch: validity.stepMismatch || false,
				tooLong: validity.tooLong || false,
				typeMismatch: validity.typeMismatch || false,
				valid: validity.valid || true,
				valueMissing: validity.valueMissing || false
			}, validity);
		},

		methods = {
			/**
			 * Check the validity of the current field
			 * @param  {object}  settings   instance settings
			 * @param  {object}  options
			 *			.revalidate - trigger validation function first?
			 * @return {Boolean}
			 */
			isValid: function (settings, options) {
				var $this = $(this);

				options = (settings && options) || {};

				// Revalidate defaults to true
				if (options.revalidate !== false) {
					$this.trigger('validate');
				}

				return $this.data('valid'); // get the validation result
			},
			allValid: function (config, options) {
				var valid = true,
					formValidity = [],
					$this = $(this),
					$allFields,
					$filteredFields,
					radioNames = [],
					getValidity = function getValidity(e, data) {
						data.e = e;
						formValidity.push(data);
					},
					settings = $.extend({}, config, options); // allow options to override settings

				options = options || {};

				$this.trigger('formValidate', {settings: $.extend(true, {}, settings)});

				// Make sure we're not triggering handlers more than we need to.
				$this.undelegate(settings.allValidSelectors,
					'.allValid', getValidity);
				$this.delegate(settings.allValidSelectors,
					'validated.allValid', getValidity);

				$allFields = $this.find(settings.allValidSelectors);

				// Filter radio buttons with the same name and keep only one,
				// since they will be checked as a group by isValid()
				$filteredFields = $allFields.filter(function(index) {
					var name;

					if(this.tagName === "INPUT"
						&& this.type === "radio") {
						name = this.name;
						if(radioNames[name] === true) {
							return false;
						}
						radioNames[name] = true;
					}
					return true;
				});

				$filteredFields.each(function () {
					var $this = $(this);
					valid = $this.h5Validate('isValid', options) && valid;
				});

				$this.trigger('formValidated', {valid: valid, elements: formValidity});
				return valid;
			},
			validate: function (settings) {
				// Get the HTML5 pattern attribute if it exists.
				// ** TODO: If a pattern class exists, grab the pattern from the patternLibrary, but the pattern attrib should override that value.
				var $this = $(this),
					pattern = $this.filter('[pattern]')[0] ? $this.attr('pattern') : false,

					// The pattern attribute must match the whole value, not just a subset:
					// "...as if it implied a ^(?: at the start of the pattern and a )$ at the end."
					re = new RegExp('^(?:' + pattern + ')$'),
					$radiosWithSameName = null,
					value = ($this.is('[type=checkbox]')) ?
							$this.is(':checked') : ($this.is('[type=radio]') ?
								// Cache all radio buttons (in the same form) with the same name as this one
								($radiosWithSameName = $this.parents('form')
									// **TODO: escape the radio buttons' name before using it in the jQuery selector
									.find('input[name="' + $this.attr('name') + '"]'))
									.filter(':checked')
									.length > 0 : $this.val()),
					errorClass = settings.errorClass,
					validClass = settings.validClass,
					errorIDbare = $this.attr(settings.errorAttribute) || false, // Get the ID of the error element.
					errorID = errorIDbare ? '#' + errorIDbare.replace(/(:|\.|\[|\])/g,'\\$1') : false, // Add the hash for convenience. This is done in two steps to avoid two attribute lookups.
					required = false,
					validity = createValidity({element: this, valid: true}),
					$checkRequired = $('<input required>'),
					maxlength;

				/*	If the required attribute exists, set it required to true, unless it's set 'false'.
				*	This is a minor deviation from the spec, but it seems some browsers have falsey 
				*	required values if the attribute is empty (should be true). The more conformant 
				*	version of this failed sanity checking in the browser environment.
				*	This plugin is meant to be practical, not ideologically married to the spec.
				*/
				// Feature fork
				if ($checkRequired.filter('[required]') && $checkRequired.filter('[required]').length) {
					required = ($this.filter('[required]').length && $this.attr('required') !== 'false');
				} else {
					required = ($this.attr('required') !== undefined);
				}

				if (settings.debug && window.console) {
					console.log('Validate called on "' + value + '" with regex "' + re + '". Required: ' + required); // **DEBUG
					console.log('Regex test: ' + re.test(value) + ', Pattern: ' + pattern); // **DEBUG
				}

				maxlength = parseInt($this.attr('maxlength'), 10);
				if (!isNaN(maxlength) && value.length > maxlength) {
						validity.valid = false;	
						validity.tooLong = true;
				}

				if (required && !value) {
					validity.valid = false;
					validity.valueMissing = true;
				} else if (pattern && !re.test(value) && value) {
					validity.valid = false;
					validity.patternMismatch = true;
				} else {
					if (!settings.RODom) {
						settings.markValid({
							element: this,
							validity: validity,
							errorClass: errorClass,
							validClass: validClass,
							errorID: errorID,
							settings: settings
						});
					}
				}

				if (!validity.valid) {
					if (!settings.RODom) {
						settings.markInvalid({
							element: this,
							validity: validity,
							errorClass: errorClass,
							validClass: validClass,
							errorID: errorID,
							settings: settings
						});
					}
				}
				$this.trigger('validated', validity);

				// If it's a radio button, also validate the other radio buttons with the same name
				// (while making sure the call is not recursive)
				if($radiosWithSameName !== null
					&& settings.alreadyCheckingRelatedRadioButtons !== true) {

					settings.alreadyCheckingRelatedRadioButtons = true;

					$radiosWithSameName
						.not($this)
						.trigger('validate');

					settings.alreadyCheckingRelatedRadioButtons = false;

				}
			},

			/**
			 * Take the event preferences and delegate the events to selected
			 * objects.
			 * 
			 * @param {object} eventFlags The object containing event flags.
			 * 
			 * @returns {element} The passed element (for method chaining).
			 */
			delegateEvents: function (selectors, eventFlags, element, settings) {
				var events = {},
					key = 0,
					validate = function () {
						settings.validate.call(this, settings);
					};
				$.each(eventFlags, function (key, value) {
					if (value) {
						events[key] = key;
					}
				});
				// key = 0;
				for (key in events) {
					if (events.hasOwnProperty(key)) {
						$(element).delegate(selectors, events[key] + '.h5Validate', validate);
					}
				}
				return element;
			},
			/**
			 * Prepare for event delegation.
			 * 
			 * @param {object} settings The full plugin state, including
			 * options. 
			 * 
			 * @returns {object} jQuery object for chaining.
			 */
			bindDelegation: function (settings) {
				var $this = $(this),
					$forms;
				// Attach patterns from the library to elements.
				// **TODO: pattern / validation method matching should
				// take place inside the validate action.
				$.each(patternLibrary, function (key, value) {
					var pattern = value.toString();
					pattern = pattern.substring(1, pattern.length - 1);
					$('.' + settings.classPrefix + key).attr('pattern', pattern);
				});

				$forms = $this.filter('form')
						.add($this.find('form'))
						.add($this.parents('form'));

				$forms
					.attr('novalidate', 'novalidate')
					.submit(checkValidityOnSubmitHandler);
					
				$forms.find("input[formnovalidate][type='submit']").click(function(){
					$(this).closest("form").unbind('submit', checkValidityOnSubmitHandler);
				});

				return this.each(function () {
					var kbEvents = {
							focusout: settings.focusout,
							focusin: settings.focusin,
							change: settings.change,
							keyup: settings.keyup
						},
						mEvents = {
							click: settings.click
						},
						activeEvents = {
							keyup: settings.activeKeyup
						};

					settings.delegateEvents(':input', settings.customEvents, this, settings);
					settings.delegateEvents(settings.kbSelectors, kbEvents, this, settings);
					settings.delegateEvents(settings.mSelectors, mEvents, this, settings);
					settings.delegateEvents(settings.activeClassSelector, activeEvents, this, settings);
					settings.delegateEvents('textarea[maxlength]', {keyup: true}, this, settings);
				});
			}
		},

		/**
		 * Event handler for the form submit event.
		 * When settings.submit is enabled:
		 *  - prevents submission if any invalid fields are found.
		 *  - Optionally validates all fields.
		 *  - Optionally moves focus to the first invalid field.
		 * 
		 * @param {object} evt The jQuery Event object as from the submit event. 
		 * 
		 * @returns {object} undefined if no validation was done, true if validation passed, false if validation didn't.
		 */
		checkValidityOnSubmitHandler = function(evt) {

			var $this,
				settings = getInstance.call(this),
				allValid;

			if(settings.submit !== true) {
				return;
			}

			$this = $(this);
			allValid = $this.h5Validate('allValid', { revalidate: settings.validateOnSubmit === true });

			if(allValid !== true) {
				evt.preventDefault();

				if(settings.focusFirstInvalidElementOnSubmit === true){
					var $invalid = $(settings.allValidSelectors, $this)
									.filter(function(index){
										return $(this).h5Validate('isValid', { revalidate: false }) !== true;
									});

					$invalid.first().focus();
				}
			}

			return allValid;
		},

		instances = [],

		buildSettings = function buildSettings(options) {
			// Combine defaults and options to get current settings.
			var settings = $.extend({}, defaults, options, methods),
				activeClass = settings.classPrefix + settings.activeClass;

			return $.extend(settings, {
				activeClass: activeClass,
				activeClassSelector: '.' + activeClass,
				requiredClass: settings.classPrefix + settings.requiredClass,
				el: this
			});
		},

		getInstance = function getInstance() {
			var $parent = $(this).closest('[data-h5-instanceId]');
			return instances[$parent.attr('data-h5-instanceId')];
		},

		setInstance = function setInstance(settings) {
			var instanceId = instances.push(settings) - 1;
			if (settings.RODom !== true) {
				$(this).attr('data-h5-instanceId', instanceId);
			}
			$(this).trigger('instance', { 'data-h5-instanceId': instanceId });
		};

	$.h5Validate = {
		/**
		 * Take a map of pattern names and HTML5-compatible regular
		 * expressions, and add them to the patternLibrary. Patterns in
		 * the library are automatically assigned to HTML element pattern
		 * attributes for validation.
		 * 
		 * @param {Object} patterns A map of pattern names and HTML5 compatible
		 * regular expressions.
		 * 
		 * @returns {Object} patternLibrary The modified pattern library
		 */
		addPatterns: function (patterns) {
			var patternLibrary = defaults.patternLibrary,
				key;
			for (key in patterns) {
				if (patterns.hasOwnProperty(key)) {
					patternLibrary[key] = patterns[key];
				}
			}
			return patternLibrary;
		},
		/**
		 * Take a valid jQuery selector, and a list of valid values to
		 * validate against.
		 * If the user input isn't in the list, validation fails.
		 * 
		 * @param {String} selector Any valid jQuery selector.
		 *
		 * @param {Array} values A list of valid values to validate selected 
		 * fields against.
		 */
		validValues: function (selector, values) {
			var i = 0,
				ln = values.length,
				pattern = '',
				re;
			// Build regex pattern
			for (i = 0; i < ln; i += 1) {
				pattern = pattern ? pattern + '|' + values[i] : values[i];
			}
			re = new RegExp('^(?:' + pattern + ')$');
			$(selector).data('regex', re);
		}
	};

	$.fn.h5Validate = function h5Validate(options) {
		var	action,
			args,
			settings;

		if (typeof options === 'string' && typeof methods[options] === 'function') {
			// Whoah, hold on there! First we need to get the instance:
			settings = getInstance.call(this);

			args = [].slice.call(arguments, 0);
			action = options;
			args.shift();
			args = $.merge([settings], args);

			// Use settings here so we can plug methods into the instance dynamically?
			return settings[action].apply(this, args);
		}

		settings = buildSettings.call(this, options);
		setInstance.call(this, settings);

		// Returning the jQuery object allows for method chaining.
		return methods.bindDelegation.call(this, settings);
	};
}(jQuery));

/*! http://mths.be/placeholder v2.0.8 by @mathias */
;(function(window, document, $) {

	// Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
	var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
	var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
	var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != safeActiveElement()) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

	function safeActiveElement() {
		// Avoid IE9 `document.activeElement` of death
		// https://github.com/mathiasbynens/jquery-placeholder/pull/99
		try {
			return document.activeElement;
		} catch (exception) {}
	}

}(this, document, jQuery));

/*! http://mths.be/details v0.1.0 by @mathias | includes http://mths.be/noselect v1.0.3 */
;(function(document, $) {

	var proto = $.fn,
	    details,
	    // :'(
	    isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]',
	    // Feature test for native `<details>` support
	    isDetailsSupported = (function(doc) {
	    	var el = doc.createElement('details'),
	    	    fake,
	    	    root,
	    	    diff;
	    	if (!('open' in el)) {
	    		return false;
	    	}
	    	root = doc.body || (function() {
	    		var de = doc.documentElement;
	    		fake = true;
	    		return de.insertBefore(doc.createElement('body'), de.firstElementChild || de.firstChild);
	    	}());
	    	el.innerHTML = '<summary>a</summary>b';
	    	el.style.display = 'block';
	    	root.appendChild(el);
	    	diff = el.offsetHeight;
	    	el.open = true;
	    	diff = diff != el.offsetHeight;
	    	root.removeChild(el);
	    	if (fake) {
	    		root.parentNode.removeChild(root);
	    	}
	    	return diff;
	    }(document)),
	    toggleOpen = function($details, $detailsSummary, $detailsNotSummary, toggle) {
	    	var isOpen = $details.prop('open'),
	    	    close = isOpen && toggle || !isOpen && !toggle;
	    	if (close) {
	    		$details.removeClass('open').prop('open', false).triggerHandler('close.details');
	    		$detailsSummary.attr('aria-expanded', false);
	    		$detailsNotSummary.hide();
	    	} else {
	    		$details.addClass('open').prop('open', true).triggerHandler('open.details');
	    		$detailsSummary.attr('aria-expanded', true);
	    		$detailsNotSummary.show();
	    	}
	    };

	/* http://mths.be/noselect v1.0.3 */
	proto.noSelect = function() {

		// Since the string 'none' is used three times, storing it in a variable gives better results after minification
		var none = 'none';

		// onselectstart and ondragstart for WebKit & IE
		// onmousedown for WebKit & Opera
		return this.bind('selectstart dragstart mousedown', function() {
			return false;
		}).css({
			'MozUserSelect': none,
			'msUserSelect': none,
			'webkitUserSelect': none,
			'userSelect': none
		});

	};

	// Execute the fallback only if there’s no native `details` support
	if (isDetailsSupported) {

		details = proto.details = function() {

			return this.each(function() {
				var $details = $(this),
				    $summary = $('summary', $details).first();
				$summary.attr({
					'role': 'button',
					'aria-expanded': $details.prop('open')
				}).on('click', function() {
					// the value of the `open` property is the old value
					var close = $details.prop('open');
					$summary.attr('aria-expanded', !close);
					$details.triggerHandler((close ? 'close' : 'open') + '.details');
				});
			});

		};

		details.support = isDetailsSupported;

	} else {

		details = proto.details = function() {

			// Loop through all `details` elements
			return this.each(function() {

				// Store a reference to the current `details` element in a variable
				var $details = $(this),
				    // Store a reference to the `summary` element of the current `details` element (if any) in a variable
				    $detailsSummary = $('summary', $details).first(),
				    // Do the same for the info within the `details` element
				    $detailsNotSummary = $details.children(':not(summary)'),
				    // This will be used later to look for direct child text nodes
				    $detailsNotSummaryContents = $details.contents(':not(summary)');

				// If there is no `summary` in the current `details` element…
				if (!$detailsSummary.length) {
					// …create one with default text
					$detailsSummary = $('<summary>').text('Details').prependTo($details);
				}

				// Look for direct child text nodes
				if ($detailsNotSummary.length != $detailsNotSummaryContents.length) {
					// Wrap child text nodes in a `span` element
					$detailsNotSummaryContents.filter(function() {
						// Only keep the node in the collection if it’s a text node containing more than only whitespace
						// http://www.whatwg.org/specs/web-apps/current-work/multipage/common-microsyntaxes.html#space-character
						return this.nodeType == 3 && /[^ \t\n\f\r]/.test(this.data);
					}).wrap('<span>');
					// There are now no direct child text nodes anymore — they’re wrapped in `span` elements
					$detailsNotSummary = $details.children(':not(summary)');
				}

				// Hide content unless there’s an `open` attribute
				$details.prop('open', typeof $details.attr('open') == 'string');
				toggleOpen($details, $detailsSummary, $detailsNotSummary);

				// Add `role=button` and set the `tabindex` of the `summary` element to `0` to make it keyboard accessible
				$detailsSummary.attr('role', 'button').noSelect().prop('tabIndex', 0).on('click', function() {
					// Focus on the `summary` element
					$detailsSummary.focus();
					// Toggle the `open` and `aria-expanded` attributes and the `open` property of the `details` element and display the additional info
					toggleOpen($details, $detailsSummary, $detailsNotSummary, true);
				}).keyup(function(event) {
					if (32 == event.keyCode || (13 == event.keyCode && !isOpera)) {
						// Space or Enter is pressed — trigger the `click` event on the `summary` element
						// Opera already seems to trigger the `click` event when Enter is pressed
						event.preventDefault();
						$detailsSummary.click();
					}
				});

			});

		};

		details.support = isDetailsSupported;

	}

}(document, jQuery));
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
