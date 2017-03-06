#!/usr/bin/env node
'use strict';

const fs = require('fs');
const pkg = require('../package.json');
const path = require('path');
const program = require('commander');
const {Client} = require('../lib');

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
    .version(pkg.version, '-v, --version')
    .option('-f, --file <file>', 'path to the coverage report');

  program.parse(process.argv);
  if (!program.file) program.help();

  // Check the report existence.
  const fileExists = file => new Promise(resolve => fs.access(file, err => resolve(!err)));

  let file = path.normalize(program.file);
  if (!await fileExists(file)) throw new Error(`The specified file is not found: ${file}`);

  // Upload the report to Coveralls.
  const readFile = file => new Promise(resolve => fs.readFile(file, 'utf8', (err, data) => resolve(err ? '' : data)));

  let client = new Client('COVERALLS_ENDPOINT' in process.env ? process.env.COVERALLS_ENDPOINT : Client.DEFAULT_ENDPOINT);
  let coverage = await readFile(file);

  console.log('[Coveralls] Submitting to', client.endPoint);
  return client.upload(coverage);
}

// Run the application.
if (module === require.main) main().catch(error => {
  console.log(error.message);
  process.exit(1);
});
