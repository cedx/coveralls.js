#!/usr/bin/env node
'use strict';

const program = require('commander');
const {access, readFile} = require('fs');
const {normalize} = require('path');
const {promisify} = require('util');

const {Client} = require('../lib');
const {version: pkgVersion} = require('../package.json');

/**
 * Application entry point.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
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

  // Check the report existence.
  const fileExists = file => new Promise(resolve => access(file, err => resolve(!err)));

  let file = normalize(program.file);
  if (!await fileExists(file)) throw new Error(`The specified file is not found: ${file}`);

  // Upload the report to Coveralls.
  const loadReport = promisify(readFile);
  let coverage = await loadReport(file, 'utf8');

  let client = new Client('COVERALLS_ENDPOINT' in process.env ? process.env.COVERALLS_ENDPOINT : Client.DEFAULT_ENDPOINT);
  console.log('[Coveralls] Submitting to', client.endPoint.href);
  return client.upload(coverage);
}

// Run the application.
if (module === require.main) main().catch(error => {
  console.error(error.message);
  process.exit(1);
});
