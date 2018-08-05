const {createHash} = require('crypto');
const {promises} = require('fs');
const {relative} = require('path');
const {parseString} = require('xml2js');
const {promisify} = require('util');

const {Job} = require('../job.js');
const {SourceFile} = require('../source_file.js');

/**
 * Returns direct child elements of the specified node.
 * @param {Object} node The node to process.
 * @param {string} name The tag name of the child elements to find.
 * @return {Array} The direct child elements with the given tag name.
 */
function findElements(node, name) {
  return name in node && Array.isArray(node[name]) ? node[name] : [];
}

/**
 * Return an attribute value of the specified node.
 * @param {Object} node The node to process.
 * @param {string} name The name of the attribute value to get.
 * @return {string} The attribute value with the given name.
 */
function getAttribute(node, name) {
  return '$' in node && typeof node.$[name] == 'string' ? node.$[name] : '';
}

/**
 * Parses the specified [Clover](https://www.atlassian.com/software/clover) coverage report.
 * @param {string} report A coverage report in Clover format.
 * @return {Promise<Job>} The job corresponding to the specified coverage report.
 */
exports.parseReport = async function parseReport(report) {
  const parseXml = promisify(parseString);
  let xml = await parseXml(report);
  if (!xml.coverage || typeof xml.coverage != 'object') throw new TypeError('The specified Clover report is invalid.');

  let projects = findElements(xml.coverage, 'project');
  if (!projects.length) throw new TypeError('The specified Clover report is empty.');

  let workingDir = process.cwd();
  let sourceFiles = [];

  for (let pkg of findElements(projects[0], 'package'))
    for (let file of findElements(pkg, 'file')) {
      let sourceFile = getAttribute(file, 'name');
      if (!sourceFile.length) throw new TypeError(`Invalid file data: ${JSON.stringify(file)}`);

      let source = await promises.readFile(sourceFile, 'utf8');
      let coverage = new Array(source.split(/\r?\n/).length).fill(null);

      for (let line of findElements(file, 'line')) {
        if (getAttribute(line, 'type') != 'stmt') continue;

        let lineNumber = Number.parseInt(getAttribute(line, 'num'), 10);
        let executionCount = Number.parseInt(getAttribute(line, 'count'), 10);
        if (Number.isNaN(lineNumber) || Number.isNaN(executionCount)) throw new TypeError(`Invalid line data: ${JSON.stringify(line)}`);

        coverage[Math.max(1, lineNumber) - 1] = Math.max(0, executionCount);
      }

      let filename = relative(workingDir, sourceFile);
      let digest = createHash('md5').update(source).digest('hex');
      sourceFiles.push(new SourceFile(filename, digest, {coverage, source}));
    }

  return new Job({sourceFiles});
};
