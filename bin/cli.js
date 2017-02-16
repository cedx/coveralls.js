#!/usr/bin/env node
'use strict';

const fs = require('fs');
const pkg = require('../package.json');
const program = require('commander');
const {Client} = require('../lib');

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

// Upload the coverage report.
let readFile = new Promise((resolve, reject) =>
  fs.readFile(program.file, 'utf8', (err, data) => {
    if (err) reject(err);
    else resolve(data);
  })
);

readFile
  .then(
    coverage => {
      let client = new Client('COVERALLS_ENDPOINT' in process.env ? process.env.COVERALLS_ENDPOINT : Client.DEFAULT_ENDPOINT);
      console.log('[Coveralls] Submitting to', client.endPoint);
      return client.upload(coverage);
    },
    () => {
      console.log('The specified file is not found.');
      process.exit(1);
    }
  )
  .catch(err => {
    console.log(err.message);
    process.exit(2);
  });
