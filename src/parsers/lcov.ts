const {Report} from '@cedx/lcov');
const {createHash} from 'crypto');
const {promises} from 'fs');
const {relative} from 'path');

const {Job} from '../job.js');
const {SourceFile} from '../source_file.js');

/**
 * Parses the specified [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage report.
 * @param {string} report A coverage report in LCOV format.
 * @return {Promise<Job>} The job corresponding to the specified coverage report.
 */
exports.parseReport = async function parseReport(report) {
  let sourceFiles = [];
  let workingDir = process.cwd();

  for (let record of Report.fromCoverage(report).records) {
    let source = await promises.readFile(record.sourceFile, 'utf8');
    let coverage = new Array(source.split(/\r?\n/).length).fill(null);
    for (let lineData of record.lines.data) coverage[lineData.lineNumber - 1] = lineData.executionCount;

    let filename = relative(workingDir, record.sourceFile);
    let digest = createHash('md5').update(source).digest('hex');
    sourceFiles.push(new SourceFile(filename, digest, {coverage, source}));
  }

  return new Job({sourceFiles});
};
