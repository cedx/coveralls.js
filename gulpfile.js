'use strict';

const child_process = require('child_process');
const del = require('del');
const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const path = require('path');

/**
 * The task plugins.
 * @type {object}
 */
const plugins = loadPlugins({
  pattern: ['gulp-*', '@*/gulp-*', 'vinyl-*'],
  replaceString: /^(gulp|vinyl)-/
});

/**
 * Runs the default tasks.
 */
gulp.task('default', ['build']);

/**
 * Builds the sources.
 */
gulp.task('build', () => gulp.src('src/**/*.js')
  .pipe(plugins.babel())
  .pipe(gulp.dest('lib'))
);

/**
 * Checks the package dependencies.
 */
gulp.task('check', () => {
  const {david} = plugins.cedx.david;
  return gulp.src('package.json').pipe(david()).on('error', function(err) {
    console.error(err);
    this.emit('end');
  });
});

/**
 * Deletes all generated files and reset any saved state.
 */
gulp.task('clean', () => del('var/**/*'));

/**
 * Sends the results of the code coverage.
 */
gulp.task('coverage', ['test'], () => _exec('node', ['bin/cli.js', '--file=var/lcov.info']));

/**
 * Builds the documentation.
 */
gulp.task('doc', async () => {
  await del('doc/api');
  return _exec(path.normalize('node_modules/.bin/esdoc'));
});

/**
 * Fixes the coding standards issues.
 */
gulp.task('fix', () => gulp.src(['*.js', 'src/**/*.js', 'test/**/*.js'], {base: '.'})
  .pipe(plugins.eslint({fix: true}))
  .pipe(gulp.dest('.'))
);

/**
 * Performs static analysis of source code.
 */
gulp.task('lint', () => gulp.src(['*.js', 'src/**/*.js', 'test/**/*.js'])
  .pipe(plugins.eslint())
  .pipe(plugins.eslint.format())
  .pipe(plugins.eslint.failAfterError())
);

/**
 * Runs the unit tests.
 */
gulp.task('test', () => _exec(path.normalize('node_modules/.bin/nyc'), [
  '--report-dir=var',
  '--reporter=lcovonly',
  path.normalize('node_modules/.bin/mocha'),
  '--compilers=js:babel-register'
]));

/**
 * Watches for file changes.
 */
gulp.task('watch', ['default'], () => {
  gulp.watch('src/**/*.js', ['build']);
});

/**
 * Runs a command and returns its output.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {object} [options] The settings to customize how the process is spawned.
 * @return {Promise} Completes when the command is finally terminated.
 */
function _exec(command, args = [], options = {shell: true, stdio: 'inherit'}) {
  return new Promise((resolve, reject) => child_process
    .spawn(command, args, options)
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : resolve())
  );
}
