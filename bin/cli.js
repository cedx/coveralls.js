#!/usr/bin/env node
'use strict';

const program = require('commander');
const {readFile} = require('fs');
const {promisify} = require('util');
const {Client} = require('../lib');
const {version: pkgVersion} = require('../package.json');

/**
 * Application entry point.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
  process.title = 'Coveralls.js';

  // Parse the command line arguments.
  program.name('coveralls')
    .description('Send a LCOV coverage report to the Coveralls service.')
    .version(pkgVersion, '-v, --version')
    .arguments('<file>')
    .action(file => program.file = file)
    .parse(process.argv);

  if (!program.file) program.help();

  // Run the program.
  const loadReport = promisify(readFile);
  let coverage = await loadReport(program.file, 'utf8');

  let client = new Client('COVERALLS_ENDPOINT' in process.env ? process.env.COVERALLS_ENDPOINT : Client.DEFAULT_ENDPOINT);
  console.log(`[Coveralls] Submitting to ${client.endPoint}`);
  return client.upload(coverage);
}

// Start the application.
if (module === require.main) main().catch(err => {
  console.error(err);
  process.exit(1);
});
