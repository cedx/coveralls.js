#!/usr/bin/env node
'use strict';

const program = require('commander');
const {access, readFile} = require('fs');
const {normalize} = require('path');
const {Observable} = require('rxjs');

const {Client} = require('../lib');
const {version: pkgVersion} = require('../package.json');

/**
 * Application entry point.
 * @return {Observable} Completes when the program is terminated.
 */
function main() {
  // Initialize the application.
  process.title = 'Coveralls.js';
  program._name = 'coveralls';

  // Parse the command line arguments.
  program
    .description('Send a LCOV coverage report to the Coveralls service.')
    .version(pkgVersion, '-v, --version')
    .option('-f, --file <file>', 'path to the coverage report');

  program.parse(process.argv);
  if (!program.file) program.help();

  // Run the program.
  const fileExists = Observable.bindNodeCallback(access);
  const loadReport = Observable.bindNodeCallback(readFile);

  let file = normalize(program.file);
  return fileExists(file)
    .mergeMap(() => loadReport(file, 'utf8'))
    .mergeMap(coverage => {
      let client = new Client('COVERALLS_ENDPOINT' in process.env ? process.env.COVERALLS_ENDPOINT : Client.DEFAULT_ENDPOINT);
      console.log('[Coveralls] Submitting to', client.endPoint.href);
      return client.upload(coverage);
    });
}

// Start the application.
if (module === require.main) main().subscribe({error: err => {
  console.error(err.message);
  process.exit(1);
}});
