## Installation

Install WebUI CLI.

Look here:
[Command line tool to install WebUI](https://github.com/mikoweb/node-webui-installer)

## How to start a project

Create a file `webui.json`:

```javascript
{
    "version": "~0.2.9",            // version of library
    "directory": "private/webui",   // library directory
    "bowerDir": "./",               // (optional) the directory where is the bower.json
    "vendorDir": "public/vendor",  // (optional) location of vendor folder; default value: directory + '/webui/vendor'
    "publicDir": "public/webui"    // (optional) public folder will be copied to this location; by default not copied
}
```

Adding dependencies to [bower.json](https://github.com/bower/spec):

```javascript
"dependencies": {
	// ..
}
```

Create a file (optional) `webui-grunt.json` to define which files are to be copied to the vendor e.g:

```javascript
{
    "copy": [
        "requirejs-text/text.js",
        "webui-tinymce-helper/tinymce.helper.min.js",
        "nunjucks/browser/nunjucks.min.js",
        {
            "directory": "webui-tinymce",
            "src": "**"
        }
        // ..
    ]
}
```

Execute the following commands:

    webui install
    webui grunt
    
## How to initialize application

Call the `startapp` function with certain options e.g [demo-init.js](https://github.com/mikoweb/webui/blob/master/demo/demo-init.js).

See the source code [demo](https://github.com/mikoweb/webui/tree/master/demo).

## License

This library is under the LGPLv3 license. See the complete license in the file:

    LICENSE

