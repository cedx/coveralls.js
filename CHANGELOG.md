# Changelog

## Version [9.4.0](https://github.com/cedx/coveralls.js/compare/v9.3.0...v9.4.0)
- Updated the package dependencies.

## Version [9.3.0](https://github.com/cedx/coveralls.js/compare/v9.2.0...v9.3.0)
- Added support for branch coverage when using [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) reports.

## Version [9.2.0](https://github.com/cedx/coveralls.js/compare/v9.1.0...v9.2.0)
- Added support for [GitHub Actions](https://github.com/features/actions).
- Added the `Job.flagName` property.
- Updated the package dependencies.

## Version [9.1.0](https://github.com/cedx/coveralls.js/compare/v9.0.0...v9.1.0)
- Due to strong user demand, restored the [TypeScript](https://www.typescriptlang.org) source code.
- Raised the [Node.js](https://nodejs.org) constraint.
- Replaced the [JSDoc](https://jsdoc.app) documentation generator by [TypeDoc](https://typedoc.org).

## Version [9.0.0](https://github.com/cedx/coveralls.js/compare/v8.6.0...v9.0.0)
- Breaking change: dropped support for [CommonJS modules](https://nodejs.org/api/modules.html).
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: reverted the source code to [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript).
- Replaced the [TypeDoc](https://typedoc.org) documentation generator by [JSDoc](https://jsdoc.app).
- Replaced the [TSLint](https://palantir.github.io/tslint) static analyzer by [ESLint](https://eslint.org).
- Updated the package dependencies.

## Version [8.6.0](https://github.com/cedx/coveralls.js/compare/v8.5.0...v8.6.0)
- Modified the package layout.
- Updated the package dependencies.

## Version [8.5.0](https://github.com/cedx/coveralls.js/compare/v8.4.0...v8.5.0)
- Added support for [ECMAScript modules](https://nodejs.org/api/esm.html).
- Updated the package dependencies.
- Updated the URL of the default endpoint.

## Version [8.4.0](https://github.com/cedx/coveralls.js/compare/v8.3.0...v8.4.0)
- Updated the package dependencies.

## Version [8.3.0](https://github.com/cedx/coveralls.js/compare/v8.2.1...v8.3.0)
- Updated the package dependencies.
- Updated the URL of the Git repository.

## Version [8.2.1](https://github.com/cedx/coveralls.js/compare/v8.2.0...v8.2.1)
- Fixed the [issue #4](https://github.com/cedx/coveralls.js/issues/4): an invalid output URL was generated when using a well-formed input URL.

## Version [8.2.0](https://github.com/cedx/coveralls.js/compare/v8.1.0...v8.2.0)
- Improved the handling of SSH-based [Git](https://git-scm.com) remotes.
- Updated the package dependencies.

## Version [8.1.0](https://github.com/cedx/coveralls.js/compare/v8.0.0...v8.1.0)
- The `Configuration.remove()` method now returns the removed value.
- The `Configuration.set()` method now uses a fluent interface.
- Updated the package dependencies.

## Version [8.0.0](https://github.com/cedx/coveralls.js/compare/v7.1.0...v8.0.0)
- Breaking change: changed the signature of the `Client`, `ClientError` and `GitRemote` constructors.
- Updated the package dependencies.

## Version [7.1.0](https://github.com/cedx/coveralls.js/compare/v7.0.0...v7.1.0)
- Ported the unit tests to classes with experimental decorators.
- Updated the package dependencies.

## Version [7.0.0](https://github.com/cedx/coveralls.js/compare/v6.0.0...v7.0.0)
- Breaking change: ported the source code to [TypeScript](https://www.typescriptlang.org).
- Breaking change: removed the `defaultValue` argument from the `Configuration.get()` method.
- Breaking change: the `Configuration.fromEnvironment()` method is now asynchronous.
- Added the `eventRequest` and `eventResponse` static properties to the `Client` class.
- Replaced the [ESDoc](https://esdoc.org) documentation generator by [TypeDoc](https://typedoc.org).
- Replaced the [ESLint](https://eslint.org) static analyzer by [TSLint](https://palantir.github.io/tslint).
- Updated the package dependencies.

## Version [6.0.0](https://github.com/cedx/coveralls.js/compare/v5.1.0...v6.0.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Added the `ClientError` class.
- Using the `fs` promises API.
- Added a user guide based on [MkDocs](http://www.mkdocs.org).
- Updated the build system to [Gulp](https://gulpjs.com) version 4.
- Updated the package dependencies.

## Version [5.1.0](https://github.com/cedx/coveralls.js/compare/v5.0.0...v5.1.0)
- Updated the package dependencies.

## Version [5.0.0](https://github.com/cedx/coveralls.js/compare/v4.0.0...v5.0.0)
- Breaking change: changed the signature of most class constructors.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: renamed the `Client.DEFAULT_ENDPOINT` property to `defaultEndPoint`.
- Breaking change: the `Configuration.fromYaml()` method now throws a `TypeError` if the document is invalid.
- Added support for [Clover](https://www.atlassian.com/software/clover) reports.
- Updated the package dependencies.

## Version [4.0.0](https://github.com/cedx/coveralls.js/compare/v3.1.0...v4.0.0)
- Breaking change: converted the [`Observable`](http://reactivex.io/intro.html)-based API to an `async/await`-based one.
- Breaking change: converted the `Subject` event API to the [`EventEmitter`](https://nodejs.org/api/events.html) one.
- Added the [`[Symbol.toStringTag]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag) property to all classes.
- Changed licensing for the [MIT License](https://opensource.org/licenses/MIT).

## Version [3.1.0](https://github.com/cedx/coveralls.js/compare/v3.0.0...v3.1.0)
- Replaced the [SuperAgent](https://visionmedia.github.io/superagent) HTTP client by `node-fetch`.
- Updated the package dependencies.

## Version [3.0.0](https://github.com/cedx/coveralls.js/compare/v2.2.0...v3.0.0)
- Breaking change: renamed the `fromJSON()` static methods to `fromJson`.
- Breaking change: renamed the `Configuration.fromYAML()` method to `fromYaml`.
- Changed the naming convention: acronyms and abbreviations are capitalized like regular words, except for two-letter acronyms.
- Updated the package dependencies.

## Version [2.2.0](https://github.com/cedx/coveralls.js/compare/v2.1.0...v2.2.0)
- Replaced the `which` module by an `Observable`-based one.
- Updated the package dependencies.

## Version [2.1.0](https://github.com/cedx/coveralls.js/compare/v2.0.0...v2.1.0)
- Removed the dependency on [Babel](https://babeljs.io) compiler.
- Updated the package dependencies.

## Version [2.0.0](https://github.com/cedx/coveralls.js/compare/v1.0.2...v2.0.0)
- Breaking change: ported the [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)-based APIs to [Observable](http://reactivex.io/intro.html).
- Breaking change: replaced the `-f|--file` named argument of the CLI script by an anonymous argument (e.g. `coveralls lcov.info` instead of `coveralls -f lcov.info`)
- Added new unit tests.
- Updated the package dependencies.

## Version [1.0.2](https://github.com/cedx/coveralls.js/compare/v1.0.1...v1.0.2)
- Fixed a display bug.

## Version [1.0.1](https://github.com/cedx/coveralls.js/compare/v1.0.0...v1.0.1)
- Fixed a code generation bug.
- Updated the package dependencies.

## Version [1.0.0](https://github.com/cedx/coveralls.js/compare/v0.8.0...v1.0.0)
- First stable release.
- Updated the package dependencies.

## Version [0.8.0](https://github.com/cedx/coveralls.js/compare/v0.7.0...v0.8.0)
- Breaking change: properties representing URLs as strings now use instances of the [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) class.
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Updated the package dependencies.

## Version [0.7.0](https://github.com/cedx/coveralls.js/compare/v0.6.0...v0.7.0)
- Added support for the [Node Security Platform](https://nodesecurity.io) reports.
- Updated the package dependencies.

## Version [0.6.0](https://github.com/cedx/coveralls.js/compare/v0.5.0...v0.6.0)
- Breaking change: renamed the `Configuration.containsKey()` method to `has`.
- Breaking change: the `Configuration.remove()` method does not return anymore the removed value.
- Replaced the internal `Configuration` parameters object by a `Map`.
- Updated the package dependencies.

## Version [0.5.0](https://github.com/cedx/coveralls.js/compare/v0.4.0...v0.5.0)
- Breaking change: dropped the dependency on [Observables](http://reactivex.io/intro.html).
- The `Client` class is now an [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter).
- Updated the package dependencies.

## Version [0.4.0](https://github.com/cedx/coveralls.js/compare/v0.3.0...v0.4.0)
- Updated the package dependencies.

## Version [0.3.0](https://github.com/cedx/coveralls.js/compare/v0.2.0...v0.3.0)
- Breaking change: raised the required [Node.js](https://nodejs.org) version.
- Breaking change: using ES2017 features, like async/await functions.
- Improved the build system.
- Ported the unit test assertions from [TDD](https://en.wikipedia.org/wiki/Test-driven_development) to [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development).
- Updated the package dependencies.

## Version [0.2.0](https://github.com/cedx/coveralls.js/compare/v0.1.0...v0.2.0)
- Fixed the documentation.
- Updated the package dependencies.

## Version 0.1.0
- Initial release.
