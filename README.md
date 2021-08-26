<div align="center">
  <a href="https://www.npmjs.com/package/import-as-module"><img src="https://img.shields.io/npm/v/import-as-module.svg?maxAge=3600" alt="NPM version" /></a>
  <a href="https://www.npmjs.com/package/import-as-module"><img src="https://img.shields.io/npm/dt/import-as-module.svg?maxAge=3600" alt="NPM downloads" /></a>
</div>

## About

Import a directory as module.

## Installation

**Node.js v12.0.0 or newer is recommended.**

### npm

```
npm i import-as-module
```

### yarn

```
yarn add import-as-module
```

### pnpm

```
pnpm add import-as-module
```

## Syntax

```js
importAsModule(path[, callback]);
```

- `path` [\<string>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [\<Buffer>](https://nodejs.org/dist/latest-v16.x/docs/api/buffer.html#buffer_class_buffer) | [\<URL>](https://nodejs.org/dist/latest-v16.x/docs/api/url.html#url_the_whatwg_url_api)

- `callback` [\<Function>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

  - `err` [\<Error>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) | [\<null>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type) null when no error

  - `path` [\<string>](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) Path to directory or file

  - `stats` [\<fs.Stats>](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fs_class_fs_stats)


Converts a directory into object with its subdirectories & files as properties.

[fs.readdirSync()](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fs_fs_readdirsync_path_options) is used to read the directory synchronously. While [fs.statSync()](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fs_fs_statsync_path_options) is used to synchronously gather [\<fs.Stats>](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fs_class_fs_stats) for each & every directory or file. A file is imported as property using CJS (commonJS) [require()](https://nodejs.org/dist/latest-v16.x/docs/api/modules.html#modules_require_id).

```
directory
├── subdirectory
│   └── file.js
└── file.js
```

```js
const importAsModule = require('import-as-module');
console.log(importAsModule('./directory'));
/* Logs:
{
  file: {},
  subdirectory: { file: {} }
}
*/
```

When subdirectory & file have similar name, parent object (object representing the above directory) is assigned a property with file's name containing two properties, i.e `dir` & `file` where `dir` represents subdirectory & `file` represents file.

```
directory
├── file
│   └── file.js
└── file.js
```

```js
const importAsModule = require('import-as-module');
console.log(importAsModule('./directory'));
/* Logs:
{
  file: {
    dir: { file: {} },
    file: {}
  }
}
*/
```


`callback` has three arguments, i.e `err`, `path` & `stats`. `err` argument returns [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) on error, else [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Null_type). `path` returns path to current directory or file. `callback`'s main purpose is to ***act as a filter*** other than detecting errors. `path` can be used to filter files by their extensions. `stats` returns [\<fs.Stats>](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fs_class_fs_stats) which helps distinguishing directories & files. By default the `callback` is:

```js
function defaultCallback(err, path, stats) {
  if (err) throw err;
  return stats.isDirectory() || /\.(js(on)?|node)$/.test(path);
}
```

## Basic Example

```
util
├── time
│   ├── isUTC.js
│   └── ms.js
└── requestHander.js
```

```js
const importAsModule = require('import-as-module');
console.log(importAsModule('./util'));
/* Logs:
{
  requestHandler: [Function: requestHandler],
  time: {
    isUTC: [Function: isUTC],
    ms: [Function: ms]
  }
}
*/
```

## Callback Example

```
server
├── router
│   ├── config.json
│   └── routes.js
├── config.json
└── index.js
```

```js
const importAsModule = require('import-as-module');
const mod = importAsModule('./server', (err, path, stats) => {
  if (err) throw err;
  return stats.isDirectory() || path.endsWith('.json');
});
console.log(mod);
/* Logs:
{
  config: {
    retryConnection: 60000,
    logger: true
  },
  router: { config: { redirect: '/' } }
}
*/
```

Sometimes, directory name may end with an extension & can cause confusion when trying to import files explicitly. `callback` can be used to overcome this problem effectively.

```
libs
├── core.js
│   ├── src
│   │   └── ...
│   ├── package.json
│   └── index.js
├── package.json
└── index.js
```

```js
const importAsModule = require('import-as-module');
const mod = importAsModule('./libs', (err, path, stats) => {
  if (err) throw err;
  return stats.isFile() && path.endsWith('.js');
});
console.log(mod);
/* Logs:
{
  index: {
    'core.js': {
      modifiers: [Object],
      prototypes: [Object],
      objects: [Object],
      utils: [Object]
    }
  }
}
*/
```

## License

Refer to [LICENSE](LICENSE) file.

## Links

- [GitHub](https://github.com/PantheraRed/import-as-module.git)
- [NPM](https://www.npmjs.com/package/import-as-module)
