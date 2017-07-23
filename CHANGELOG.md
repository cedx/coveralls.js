# Changelog
This file contains highlights of what changes on each version of the [Coveralls for JS](https://github.com/cedx/coveralls.js) library.

## Version 2.1.0
- Removed the dependency on [Babel](https://babeljs.io) compiler.
- Updated the package dependencies.

## Version 2.0.0
- Breaking change: ported the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based APIs to [Observable](http://reactivex.io/intro.html).
- Breaking change: replaced the `-f|--file` named argument of the CLI script by an anonymous argument (e.g. `coveralls lcov.info` instead of `coveralls -f lcov.info`)
- Added new unit tests.
- Updated the package dependencies.

## Version 1.0.2
- Fixed a display bug.

## Version 1.0.1
- Fixed a code generation bug.
- Updated the package dependencies.

## Version 1.0.0
- First stable release.
- Updated the package dependencies.

## Version 0.8.0
- Breaking change: properties representing URLs as strings now use instances of the [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) class.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Updated the package dependencies.

## Version 0.7.0
- Added support for the [Node Security Platform](https://nodesecurity.io) reports.
- Updated the package dependencies.

## Version 0.6.0
- Breaking change: renamed the `Configuration#containsKey` method to `has`.
- Breaking change: the `Configuration#remove` does not return anymore the removed value.
- Replaced the internal `Configuration` parameters object by a `Map`.
- Updated the package dependencies.

## Version 0.5.0
- Breaking change: dropped the dependency on [Observables](http://reactivex.io/intro.html).
- The `Client` class is now an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).
- Updated the package dependencies.

## Version 0.4.0
- Updated the package dependencies.

## Version 0.3.0
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: using ES2017 features, like async/await functions.
- Improved the build system.
- Ported the unit test assertions from [TDD](https://en.wikipedia.org/wiki/Test-driven_development) to [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development).
- Updated the package dependencies.

## Version 0.2.0
- Fixed the documentation.
- Updated the package dependencies.

## Version 0.1.0
- Initial release.
