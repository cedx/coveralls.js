'use strict';
const {spawn} = require('child_process');
const del = require('del');
const {promises} = require('fs');
const {dest, series, src, task, watch} = require('gulp');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const {delimiter, normalize, resolve} = require('path');
const pkg = require('./package.json');

// Initialize the build system.
const _path = 'PATH' in process.env ? process.env.PATH : '';
const _vendor = resolve('node_modules/.bin');
if (!_path.includes(_vendor)) process.env.PATH = `${_vendor}${delimiter}${_path}`;

/**
 * The file patterns providing the list of source files.
 * @type {string[]}
 */
const sources = ['*.js', 'bin/*.js', 'example/*.ts', 'src/**/*.ts', 'test/**/*.ts'];

/**
 * Builds the project.
 */
task('build:cjs', () => _exec('tsc'));
task('build:esm', () => _exec('tsc', ['--project', 'src/tsconfig.json']));
task('build:rename', () => src('lib/**/*.js').pipe(rename({extname: '.mjs'})).pipe(dest('lib')));
task('build', series('build:esm', 'build:rename', 'build:cjs'));

/**
 * Deletes all generated files and reset any saved state.
 */
task('clean', () => del(['.nyc_output', 'doc/api', 'lib', 'var/**/*', 'web']));

/**
 * Uploads the results of the code coverage.
 */
task('coverage', () => _exec('node', ['bin/coveralls.js', 'var/lcov.info']));

/**
 * Builds the documentation.
 */
task('doc', async () => {
  for (const path of ['CHANGELOG.md', 'LICENSE.md']) await promises.copyFile(path, `doc/about/${path.toLowerCase()}`);
  await _exec('typedoc', ['--options', 'doc/typedoc.js']);
  await _exec('mkdocs', ['build', '--config-file=doc/mkdocs.yml']);
  return del(['doc/about/changelog.md', 'doc/about/license.md', 'web/mkdocs.yml', 'web/typedoc.js']);
});

/**
 * Fixes the coding standards issues.
 */
task('fix', () => _exec('tslint', ['--fix', ...sources]));

/**
 * Performs the static analysis of source code.
 */
task('lint', () => _exec('tslint', sources));

/**
 * Runs the test suites.
 */
task('test', () => _exec('nyc', [
  '--nycrc-path=test/.nycrc',
  normalize('node_modules/.bin/mocha'),
  '--config=test/.mocharc.yaml',
  '"test/**/*.ts"'
]));

/**
 * Upgrades the project to the latest revision.
 */
task('upgrade', async () => {
  await _exec('git', ['reset', '--hard']);
  await _exec('git', ['fetch', '--all', '--prune']);
  await _exec('git', ['pull', '--rebase']);
  await _exec('npm', ['install', '--ignore-scripts']);
  return _exec('npm', ['update', '--dev']);
});

/**
 * Updates the version number contained in the sources.
 */
task('version', () => src('bin/coveralls.js')
  .pipe(replace(/const version = '\d+(\.\d+){2}'/g, `const version = '${pkg.version}'`))
  .pipe(dest('bin'))
);

/**
 * Watches for file changes.
 */
task('watch', () => {
  watch('src/**/*.ts', {ignoreInitial: false}, task('build'));
  watch('test/**/*.ts', task('test'));
});

/**
 * Runs the default tasks.
 */
task('default', series('build', 'version'));

/**
 * Spawns a new process using the specified command.
 * @param {string} command The command to run.
 * @param {string[]} [args] The command arguments.
 * @param {Partial<SpawnOptions>} [options] The settings to customize how the process is spawned.
 * @return {Promise<void>} Completes when the command is finally terminated.
 */
function _exec(command, args = [], options = {}) {
  return new Promise((fulfill, reject) => spawn(normalize(command), args, Object.assign({shell: true, stdio: 'inherit'}, options))
    .on('close', code => code ? reject(new Error(`${command}: ${code}`)) : fulfill())
  );
}
