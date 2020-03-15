import {Report} from '@cedx/lcov';
import {createHash} from 'crypto';
import {promises} from 'fs';
import {isAbsolute, normalize, relative} from 'path';

import {Job} from '../job';
import {SourceFile} from '../source_file';

/**
 * Parses the specified [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage report.
 * @param report A coverage report in LCOV format.
 * @return The job corresponding to the specified coverage report.
 */
export async function parseReport(report: string): Promise<Job> {
  const sourceFiles = [];
  const workingDir = process.cwd();

  for (const record of Report.fromCoverage(report).records) {
    const source = await promises.readFile(record.sourceFile, 'utf8');
    const lineCoverage = new Array(source.split(/\r?\n/).length).fill(null);
    if (record.lines) for (const lineData of record.lines.data) lineCoverage[lineData.lineNumber - 1] = lineData.executionCount;

    const branchCoverage = [];
    if (record.branches) for (const branchData of record.branches.data) branchCoverage.push(
      branchData.lineNumber,
      branchData.blockNumber,
      branchData.branchNumber,
      branchData.taken
    );

    const filename = isAbsolute(record.sourceFile) ? relative(workingDir, record.sourceFile) : normalize(record.sourceFile);
    const digest = createHash('md5').update(source).digest('hex');
    sourceFiles.push(new SourceFile(filename, digest, {branches: branchCoverage, coverage: lineCoverage, source}));
  }

  return new Job({sourceFiles});
}
