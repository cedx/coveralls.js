#!/usr/bin/env node
'use strict';

const program from 'commander');
const {promises} from 'fs');
const {Client} from '../lib';
const pkg from '../package.json');

/**
 * Application entry point.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
  process.title = 'Coveralls.js';

  // Parse the command line arguments.
  program.name('coveralls')
    .description('Send a coverage report to the Coveralls service.')
    .version(pkg.version, '-v, --version')
    .arguments('<file>')
    .action(file => program.file = file)
    .parse(process.argv);

  if (!program.file) {
    program.outputHelp();
    process.exitCode = 64;
    return null;
  }

  // Run the program.
  let client = new Client('COVERALLS_ENDPOINT' in process.env ? process.env.COVERALLS_ENDPOINT : Client.defaultEndPoint);
  let coverage = await promises.readFile(program.file, 'utf8');
  console.log(`[Coveralls] Submitting to ${client.endPoint}`);
  return client.upload(coverage);
}

// Start the application.
if (module === require.main) main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
