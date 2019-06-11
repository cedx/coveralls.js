/* eslint-disable no-unused-vars */
import {Client, ClientError} from '@cedx/coveralls';
import {promises} from 'fs';

/**
 * Uploads a coverage report.
 * @return {Promise} Completes when the program is terminated.
 */
async function main() {
  try {
    const coverage = await promises.readFile('/path/to/coverage.report', 'utf8');
    await new Client().upload(coverage);
    console.log('The report was sent successfully.');
  }

  catch (error) {
    console.log(`An error occurred: ${error.message}`);
    if (error instanceof ClientError) console.log(`From: ${error.uri}`);
  }
}
