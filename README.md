# WebUI Boilerplate

## Installation

Create the following files:

`package.json`

```json
{
  "scripts": {
	"webui": "webui",
	"install": "webui copy-engine && webui copy-libs"
  },
  "dependencies": {
	"webui-cli": "~1.0.0",
    "webui-boilerplate": "~1.0.1"
  }
}
```

`webui.json`

```json
{
    "version": "~1.0.1",
    "directory": "private/webui",
    "publicDir": "public/webui",
    "libDir": "public/lib",
    "libs": []
}
```

Run command:

    npm install

## File webui.json

Option | Description | Type | Required | Default
:---: | --- | :---: | :---: | :---:
`version` | Default version of Boilerplate which is install when run `webui install`. | `string|null` | 0 | `null`
`directory` | Location where are copied engine files. | `string` | 1 | `webui`
`publicDir` | Location where are copied public files. | `string|null` | 0 | `null`
`libDir` | Location where are copied libraries. | `string|null` | 0 | `null`
`libs` | Table of libraries. Used to generate `.requirejsrc` file. | `array` | 1 | `[]`
`package` | Name of boilerplate package. | `string` | 1 | `webui-boilerplate`

## Commands

Copy engine files.

    npm run webui -- copy-engine

Copy libraries and build `.requirejsrc`.

    npm run webui -- copy-libs

More informations in [cli repo](https://github.com/mikoweb/webui-cli).

## Libraries example

`package.json`

```json
{
  // ..
  "dependencies": {
    // ..
    "select2": "~4.0.0"
  }
}
```

`webui.json`

```json
{
    // ..
    "libs": [
      // copy file from node_module/select2/dist/js/select2.full.min.js to lib/select2/select2.js
      ["select2", "select2/dist/js/select2.full.min.js", "select2/select2.js"],
      // copy directory from node_module/select2/dist/js/i18n to lib/select2/i18n
      ["select2-i18n", "select2/dist/js/i18n", "select2/i18n"]
    ]
}
```

Tab index | Description | Type | Required
:---: | --- | :---: | :---: 
`0` | Name of RequireJS module. | `string` | 1 | `null` 
`1` | Source file, files separated by comma or directory. [fileconcat](https://github.com/okunishinishi/node-fileconcat/tree/v1.1.2#usage); [fs-extra](https://www.npmjs.com/package/fs-extra#copy) | `string` | 1 
`2` | Destination location. | `string` | 1 
`3` | Additional options separated by `|`. Accepts option `uglify` to minify dest. | `string` | 0 

## How to initialize application

Call the `startapp` function with certain options e.g [demo-init.js](https://github.com/mikoweb/webui-boilerplate/blob/master/demo/demo-init.js).

See the source code [demo](https://github.com/mikoweb/webui-boilerplate/tree/master/demo).

## License

This library is under the LGPLv3 license. See the complete license in the file:

    LICENSE

