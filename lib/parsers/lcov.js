import {Report} from '@cedx/lcov';
import crypto from 'crypto';
import {promises} from 'fs';
import {relative} from 'path';

import {Job} from '../job.js';
import {SourceFile} from '../source_file.js';

/**
 * Parses the specified [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage report.
 * @param {string} report A coverage report in LCOV format.
 * @return {Promise<Job>} The job corresponding to the specified coverage report.
 */
export async function parseReport(report) {
  const sourceFiles = [];
  const workingDir = process.cwd();

  for (const record of Report.fromCoverage(report).records) {
    const source = await promises.readFile(record.sourceFile, 'utf8');
    const coverage = new Array(source.split(/\r?\n/).length).fill(null);
    if (record.lines) for (const lineData of record.lines.data) coverage[lineData.lineNumber - 1] = lineData.executionCount;

    const filename = relative(workingDir, record.sourceFile);
    const digest = crypto.createHash('md5').update(source).digest('hex');
    sourceFiles.push(new SourceFile(filename, digest, {coverage, source}));
  }

  return new Job({sourceFiles});
}
