# Coveralls for JS
![Release](https://img.shields.io/npm/v/@cedx/coveralls.svg) ![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg) ![Dependencies](https://david-dm.org/cedx/coveralls.js.svg) ![Coverage](https://coveralls.io/repos/github/cedx/coveralls.js/badge.svg) ![Build](https://travis-ci.org/cedx/coveralls.js.svg)

Send [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage reports to the [Coveralls](https://coveralls.io) service, in [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).

## Requirements
The latest [Node.js](https://nodejs.org) and [npm](https://www.npmjs.com) versions.
If you plan to play with the sources, you will also need the latest [Gulp.js](http://gulpjs.com) version.

## Usage

### Command line interface
The easy way. From a command prompt with administrator privileges, install the `coveralls` executable:

```shell
$ npm install --global @cedx/coveralls
```

Then use it to upload your coverage reports:

```shell
$ coveralls --help

  Usage: coveralls [options]

  Options:

    -h, --help         output usage information
    -v, --version      output the version number
    -f, --file <file>  path to the coverage report
```

For example:

```shell
$ coveralls -f build/lcov.info
```

### Programming interface
The hard way. From a command prompt, install the library:
              
```shell
$ npm install --save @cedx/coveralls
```

Now, in your [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) code, you can use the `Client` class to upload your coverage reports:

```javascript
const fs = require('fs');
const {Client} = require('@cedx/coveralls');

try {
  let coverage = fs.readFileSync('/path/to/coverage.report', 'utf8');
  new Client().upload(coverage);
  console.log('The report was sent successfully.');
}

catch (err) {
  console.log('An error occurred:', err.message);
}
```

## Supported coverage formats
Currently, this package only supports the de facto standard: the [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) format.

## Supported CI services
This project has been tested with [Travis CI](https://travis-ci.com) service, but these services should also work with no extra effort:
- [AppVeyor](https://www.appveyor.com)
- [CircleCI](https://circleci.com)
- [Codeship](https://codeship.com)
- [GitLab CI](https://gitlab.com)
- [Jenkins](https://jenkins.io)
- [Semaphore](https://semaphoreci.com)
- [Solano CI](https://ci.solanolabs.com)
- [Surf](https://github.com/surf-build/surf)
- [Wercker](http://www.wercker.com)

## Environment variables
If your build system is not supported, you can still use this package.
There are a few environment variables that are necessary for supporting your build system:
- `COVERALLS_SERVICE_NAME` : the name of your build system.
- `COVERALLS_REPO_TOKEN` : the secret repository token from [Coveralls](https://coveralls.io).

There are optional environment variables:
- `COVERALLS_SERVICE_JOB_ID` : a string that uniquely identifies the build job.
- `COVERALLS_RUN_AT` : a date string for the time that the job ran. This defaults to your build system's date/time if you don't set it.

The full list of supported environment variables is available in the source code of the `Configuration` class (see the `fromEnvironment()` static method).

## The `.coveralls.yml` file
This package supports the same configuration sources as the [Coveralls](https://coveralls.io) ones:  
[Coveralls currently supports](https://coveralls.zendesk.com/hc/en-us/articles/201347419-Coveralls-currently-supports)

## See also
- [API reference](https://cedx.github.io/coveralls.js)
- [Code coverage](https://coveralls.io/github/cedx/coveralls.js)
- [Continuous integration](https://travis-ci.org/cedx/coveralls.js)

## License
[Coveralls for JS](https://github.com/cedx/coveralls.js) is distributed under the Apache License, version 2.0.
