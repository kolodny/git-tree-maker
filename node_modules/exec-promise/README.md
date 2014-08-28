# exec-promise

[![Build Status](https://img.shields.io/travis/julien-f/nodejs-exec-promise/master.svg)](http://travis-ci.org/julien-f/nodejs-exec-promise)
[![Dependency Status](https://david-dm.org/julien-f/nodejs-exec-promise/status.svg?theme=shields.io)](https://david-dm.org/julien-f/nodejs-exec-promise)
[![devDependency Status](https://david-dm.org/julien-f/nodejs-exec-promise/dev-status.svg?theme=shields.io)](https://david-dm.org/julien-f/nodejs-exec-promise#info=devDependencies)

> Testable CLIs with promises

## Introduction

**TODO**

- executables should be testable
- the execution flow should be predictable and followable (promises)

## Install

Download [manually](https://github.com/julien-f/nodejs-exec-promise/releases) or with package-manager.

#### [npm](https://npmjs.org/package/exec-promise)

```
npm install --save exec-promise
```

## Example

`./cli.js`:

```javascript
module.exports = function (args) {
  if (args.indexOf('-h') !== -1) {
    return 'Usage: my-program [-h | -v]';
  }

  if (args.indexOf('-v') !== -1) {
    var pkg = require('./package');
    return 'MyProgram version '+ pkg.version;
  }

  var server = require('http').createServer();
  server.listen(80);

  // The program will run until the server closes or encounters an
  // error.
  return require('event-to-promise')(server, 'close');
}

// Executes the exported function if this module has been called
// directly.
if (!module.parent) {
  require('exec-promise')(module.exports)
}
```

## Contributing

Contributions are *very* welcome, either on the documentation or on
the code.

You may:

- report any [issue](https://github.com/julien-f/human-format/issues)
  you've encountered;
- fork and create a pull request.

## License

ISC © [Julien Fontanet](http://julien.isonoe.net)
