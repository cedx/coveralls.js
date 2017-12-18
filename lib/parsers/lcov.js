'use strict';

const {Report} = require('@cedx/lcov');
const {createHash} = require('crypto');
const {readFile} = require('fs');
const {relative} = require('path');
const {promisify} = require('util');

const {Job} = require('../job.js');
const {SourceFile} = require('../source_file.js');

/**
 * Parses the specified [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage report.
 * @param {string} report A coverage report in LCOV format.
 * @return {Promise<Job>} The job corresponding to the specified coverage report.
 */
exports.parseReport = async function parseReport(report) {
  const loadFile = promisify(readFile);
  let sourceFiles = [];
  let workingDir = process.cwd();

  for (let record of Report.fromCoverage(report).records) {
    let source = await loadFile(record.sourceFile, 'utf8');
    let coverage = new Array(source.split(/\r?\n/).length).fill(null);
    for (let lineData of record.lines.data) coverage[lineData.lineNumber - 1] = lineData.executionCount;

    let filename = relative(workingDir, record.sourceFile);
    let digest = createHash('md5').update(source).digest('hex');
    sourceFiles.push(new SourceFile(filename, digest, {coverage, source}));
  }

  return new Job({sourceFiles});
};
