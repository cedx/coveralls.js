path: src/branch/master
source: bin/main.js

# Command line interface
The easy way. From a command prompt with administrator privileges, install the `coveralls` executable:

```shell
npm install --global @cedx/coveralls
```

!!! tip
    Consider adding the [`npm install --global`](https://docs.npmjs.com/files/folders) executables directory to your system path.

Then use it to upload your coverage reports:

```shell
$ coveralls --help

  Usage: coveralls [options] <file>

  Send a coverage report to the Coveralls service.

  Options:

    -h, --help         output usage information
    -v, --version      output the version number
```

For example:

```shell
coveralls build/lcov.info
```
