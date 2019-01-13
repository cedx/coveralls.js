#!/usr/bin/env node
'use strict';

/* tslint:disable: no-console */
const program = require('commander');
const {promises} = require('fs');
const {Client} = require('../lib');

/**
 * The version number of the package.
 * @type {string}
 */
const version = '8.3.0';

/**
 * Application entry point.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
  // Initialize the application.
  process.title = 'Coveralls.js';

  // Parse the command line arguments.
  program.name('coveralls')
    .description('Send a coverage report to the Coveralls service.')
    .version(version, '-v, --version')
    .arguments('<file>').action(file => program.file = file)
    .parse(process.argv);

  if (!program.file) {
    program.outputHelp();
    process.exitCode = 64;
    return null;
  }

  // Run the program.
  const client = new Client('COVERALLS_ENDPOINT' in process.env ? new URL(process.env.COVERALLS_ENDPOINT) : Client.defaultEndPoint);
  const coverage = await promises.readFile(program.file, 'utf8');
  console.log(`[Coveralls] Submitting to ${client.endPoint}`);
  return client.upload(coverage);
}

// Start the application.
main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
