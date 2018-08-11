const {createHash} from 'crypto');
const {promises} from 'fs');
const {relative} from 'path');
const {parseString} from 'xml2js');
const {promisify} from 'util');

const {Job} from '../job.js');
const {SourceFile} from '../source_file.js');

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
  const xml = await parseXml(report);
  if (!xml.coverage || typeof xml.coverage != 'object') throw new TypeError('The specified Clover report is invalid.');

  const projects = findElements(xml.coverage, 'project');
  if (!projects.length) throw new TypeError('The specified Clover report is empty.');

  const workingDir = process.cwd();
  const sourceFiles = [];

  for (const pkg of findElements(projects[0], 'package'))
    for (const file of findElements(pkg, 'file')) {
      const sourceFile = getAttribute(file, 'name');
      if (!sourceFile.length) throw new TypeError(`Invalid file data: ${JSON.stringify(file)}`);

      const source = await promises.readFile(sourceFile, 'utf8');
      const coverage = new Array(source.split(/\r?\n/).length).fill(null);

      for (const line of findElements(file, 'line')) {
        if (getAttribute(line, 'type') != 'stmt') continue;

        const lineNumber = Number.parseInt(getAttribute(line, 'num'), 10);
        const executionCount = Number.parseInt(getAttribute(line, 'count'), 10);
        if (Number.isNaN(lineNumber) || Number.isNaN(executionCount)) throw new TypeError(`Invalid line data: ${JSON.stringify(line)}`);

        coverage[Math.max(1, lineNumber) - 1] = Math.max(0, executionCount);
      }

      const filename = relative(workingDir, sourceFile);
      const digest = createHash('md5').update(source).digest('hex');
      sourceFiles.push(new SourceFile(filename, digest, {coverage, source}));
    }

  return new Job({sourceFiles});
};