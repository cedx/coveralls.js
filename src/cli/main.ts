import program from 'commander';
import {promises} from 'fs';
import {Client} from '../io/client';
import {packageVersion} from './version.g';

/** Application entry point. */
export async function main(): Promise<void> {
  // Initialize the application.
  process.title = 'Coveralls.js';

  // Parse the command line arguments.
  program.name('coveralls')
    .description('Send a coverage report to the Coveralls service.')
    .version(packageVersion, '-v, --version')
    .arguments('<file>').action(file => program.file = file)
    .parse(process.argv);

  if (!program.file) {
    program.outputHelp();
    process.exitCode = 64;
    return;
  }

  // Run the program.
  const client = new Client('COVERALLS_ENDPOINT' in process.env ? new URL(process.env.COVERALLS_ENDPOINT!) : Client.defaultEndPoint);
  const coverage = await promises.readFile(program.file, 'utf8');
  console.log(`[Coveralls] Submitting to ${client.endPoint}`);
  return client.upload(coverage);
}
