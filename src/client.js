import {Report, Token} from '@cedx/lcov';
import {createHash} from 'crypto';
import EventEmitter from 'events';
import {readFile} from 'fs';
import {relative} from 'path';
import superagent from 'superagent';
import {URL} from 'url';
import which from 'which';

import {Configuration} from './configuration';
import {GitCommit} from './git_commit';
import {GitData} from './git_data';
import {Job} from './job';
import {SourceFile} from './source_file';

/**
 * Uploads code coverage reports to the [Coveralls](https://coveralls.io) service.
 */
export class Client extends EventEmitter {

  /**
   * The URL of the default API end point.
   * @type {URL}
   */
  static get DEFAULT_ENDPOINT() {
    return new URL('https://coveralls.io');
  }

  /**
   * Initializes a new instance of the class.
   * @param {string|URL} [endPoint] The URL of the API end point.
   */
  constructor(endPoint = Client.DEFAULT_ENDPOINT) {
    super();

    /**
     * The URL of the API end point.
     * @type {URL}
     */
    this.endPoint = typeof endPoint == 'string' ? new URL(endPoint) : endPoint;
  }

  /**
   * Uploads the specified code coverage report to the Coveralls service.
   * @param {string} coverage A coverage report.
   * @param {Configuration} [configuration] The environment settings.
   * @return {Promise} Completes when the operation is done.
   * @emits {superagent.Request} The "request" event.
   * @emits {superagent.Response} The "response" event.
   */
  async upload(coverage, configuration = null) {
    coverage = coverage.trim();
    if (!coverage.length) throw new Error('The specified coverage report is empty.');

    let token = coverage.substr(0, 3);
    if (token != `${Token.TEST_NAME}:` && token != `${Token.SOURCE_FILE}:`)
      throw new Error('The specified coverage format is not supported.');

    let [job, config, git] = await Promise.all([
      this._parseReport(coverage),
      configuration ? Promise.resolve(configuration) : Configuration.loadDefaults(),
      new Promise(resolve => which('git', async err => {
        if (err) resolve(null);
        else resolve(await GitData.fromRepository());
      }))
    ]);

    this._updateJob(job, config);
    if (!job.runAt) job.runAt = new Date;

    if (git) {
      let branch = job.git ? job.git.branch : '';
      if (git.branch == 'HEAD' && branch.length) git.branch = branch;
      job.git = git;
    }

    return this.uploadJob(job);
  }

  /**
   * Uploads the specified job to the Coveralls service.
   * @param {Job} job The job to be uploaded.
   * @return {Promise} Completes when the operation is done.
   * @emits {superagent.Request} The "request" event.
   * @emits {superagent.Response} The "response" event.
   */
  async uploadJob(job) {
    if (!job.repoToken.length && !job.serviceName.length)
      throw new Error('The job does not meet the requirements.');

    let request = superagent
      .post(new URL('api/v1/jobs', this.endPoint).href)
      .attach('json_file', Buffer.from(JSON.stringify(job)), 'coveralls.json');

    this.emit('request', request);
    let response = await request;
    this.emit('response', response);

    if (response.status != 200) throw new Error(`${response.status} ${response.statusText}`);
    return null;
  }

  /**
   * Parses the specified [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage report.
   * @param {string} report A coverage report in LCOV format.
   * @return {Promise<Job>} The job corresponding to the specified coverage report.
   */
  async _parseReport(report) {
    let workingDir = process.cwd();
    return new Job(await Promise.all(Report.parse(report).records.map(record => new Promise((resolve, reject) =>
      readFile(record.sourceFile, 'utf8', (err, source) => {
        if (err) reject(new Error(`Source file not found: ${record.sourceFile}`));
        else {
          let lines = source.split(/\r?\n/);
          let coverage = new Array(lines.length).fill(null);
          for (let lineData of record.lines.data) coverage[lineData.lineNumber - 1] = lineData.executionCount;

          let filename = relative(workingDir, record.sourceFile);
          let digest = createHash('md5').update(source).digest('hex');
          resolve(new SourceFile(filename, digest, source, coverage));
        }
      })
    ))));
  }

  /**
   * Updates the properties of the specified job using the given configuration parameters.
   * @param {Job} job The job to update.
   * @param {Configuration} config The parameters to define.
   */
  _updateJob(job, config) {
    if (config.has('repo_token')) job.repoToken = config.get('repo_token');
    else if (config.has('repo_secret_token')) job.repoToken = config.get('repo_secret_token');

    if (config.has('parallel')) job.isParallel = config.get('parallel') == 'true';
    if (config.has('run_at')) job.runAt = new Date(config.get('run_at'));
    if (config.has('service_job_id')) job.serviceJobId = config.get('service_job_id');
    if (config.has('service_name')) job.serviceName = config.get('service_name');
    if (config.has('service_number')) job.serviceNumber = config.get('service_number');
    if (config.has('service_pull_request')) job.servicePullRequest = config.get('service_pull_request');

    let hasGitData = config.keys.some(key => key == 'service_branch' || key.substr(0, 4) == 'git_');
    if (!hasGitData) job.commitSha = config.has('commit_sha') ? config.get('commit_sha') : '';
    else {
      let commit = new GitCommit(
        config.has('commit_sha') ? config.get('commit_sha') : '',
        config.has('git_message') ? config.get('git_message') : ''
      );

      commit.authorEmail = config.has('git_author_email') ? config.get('git_author_email') : '';
      commit.authorName = config.has('git_author_name') ? config.get('git_author_name') : '';
      commit.committerEmail = config.has('git_committer_email') ? config.get('git_committer_email') : '';
      commit.committerName = config.has('git_committer_email') ? config.get('git_committer_email') : '';

      job.git = new GitData(commit, config.has('service_branch') ? config.get('service_branch') : '');
    }
  }
}
