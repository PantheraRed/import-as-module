'use strict';

// Adapted from https://stackoverflow.com/questions/11194287/convert-a-directory-structure-in-the-filesystem-to-json-with-node-js

const { statSync, readdirSync } = require('fs');
const { parse, resolve } = require('path');

function defaultCallback(err, path, stats) {
  if (err) throw err;
  return stats.isDirectory() || /\.(js(on)?|node)$/.test(path);
}

function importAsModule(path, callback = defaultCallback) {
  if (typeof callback != 'function') throw new TypeError('Callback must be a function. Received ' + typeof callback);
  const mod = {};

  readdirSync(path).forEach(file => {
    const filename = resolve(path, file),
      stats = statSync(filename),
      cb = callback(undefined, filename, stats);

    if (stats.isFile() && cb) {
      const t = require(filename);
      const { name } = parse(file);
      const dir = mod[name];

      if (dir) {
        mod[name] = { dir, file: t };
      } else {
        mod[name] = t;
      }
    } else if (stats.isDirectory() && cb) {
      try {
        mod[file] = importAsModule(filename, callback);
      } catch (err) {
        callback(err, filename, stats);
      }
    }
  });

  return mod;
}

module.exports = importAsModule;
