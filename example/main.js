/* eslint-disable no-unused-vars */
const {Client, ClientError} = require('@cedx/coveralls');
const {promises} = require('fs');

/**
 * Uploads a coverage report.
 */
async function main() {
  try {
    let coverage = await promises.readFile('/path/to/coverage.report', 'utf8');
    await new Client().upload(coverage);
    console.log('The report was sent successfully.');
  }

  catch (error) {
    console.log(`An error occurred: ${error.message}`);
    if (error instanceof ClientError) console.log(`From: ${error.uri.href}`);
  }
}
