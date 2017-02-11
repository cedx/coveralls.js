import {Report, Token} from '@cedx/lcov';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {Subject} from 'rxjs';
import superagent from 'superagent';
import which from 'which';

import {Configuration} from './configuration';
import {GitCommit} from './git_commit';
import {GitData} from './git_data';
import {Job} from './job';
import {SourceFile} from './source_file';

/**
 * Uploads code coverage reports to the [Coveralls](https://coveralls.io) service.
 */
export class Client {

  /**
   * The URL of the default end point.
   * @type {string}
   */
  static get DEFAULT_ENDPOINT() {
    return 'https://coveralls.io/api/v1/jobs';
  }

  /**
   * Initializes a new instance of the class.
   * @param {string} [endPoint] The URL of the API end point.
   */
  constructor(endPoint = Client.DEFAULT_ENDPOINT) {

    /**
     * The URL of the API end point.
     * @type {string}
     */
    this.endPoint = endPoint;

    /**
     * The handler of "request" events.
     * @type {Subject<superagent.Request>}
     */
    this._onRequest = new Subject();

    /**
     * The handler of "response" events.
     * @type {Subject<superagent.Response>}
     */
    this._onResponse = new Subject();
  }

  /**
   * The stream of "request" events.
   * @type {Observable<superagent.Request>}
   */
  get onRequest() {
    return this._onRequest.asObservable();
  }

  /**
   * The stream of "response" events.
   * @type {Observable<superagent.Response>}
   */
  get onResponse() {
    return this._onResponse.asObservable();
  }

  /**
   * Uploads the specified code coverage report to the Coveralls service.
   * @param {string} coverage A coverage report.
   * @param {Configuration} [configuration] The environment settings.
   * @return {Promise} Completes when the operation is done.
   */
  upload(coverage, configuration = null) {
    coverage = coverage.trim();
    if (!coverage.length) return Promise.reject(new Error('The specified coverage report is empty.'));

    let promise = configuration ? Promise.resolve(configuration) : Configuration.loadDefaults();
    return promise.then(config => {
      // Parse the coverage.
      let token = coverage.trim().substr(0, 3);
      if (token != `${Token.TEST_NAME}:` && token != `${Token.SOURCE_FILE}:`)
        throw new Error('The specified coverage format is not supported.');

      let job = this._parseReport(coverage);

      // Apply the configuration settings.

      return this.uploadJob(job);
    });
  }

  /**
   * Uploads the specified job to the Coveralls service.
   * @param {Job} job The job to be uploaded.
   * @return {Promise} Completes when the operation is done.
   */
  uploadJob(job) {
    if (!job.repoToken.length && !job.serviceName.length)
      return Promise.reject(new Error('The job does not meet the requirements.'));

    // TODO
    return new Promise((resolve, reject) => {
      let req = superagent.get(Client.END_POINT).query({
        msg: message.substr(0, 160),
        pass: this.password,
        user: this.username
      });

      this._onRequest.next(req);
      req.end((err, res) => {
        if (err) reject(err);
        else {
          this._onResponse.next(res);
          resolve(res.status == 200);
        }
      });
    });
  }

  /**
   * Parses the specified [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage report.
   * @param {string} report A coverage report in LCOV format.
   * @return {Promise<Job>} The job corresponding to the specified coverage report.
   */
  _parseReport(report) {
    let promises = Report.parse(report).records.map(record => new Promise((resolve, reject) => {
      fs.readFile(record.sourceFile, 'utf8', (err, source) => {
        if (err) reject(new Error(`Source file not found: ${record.sourceFile}`));
        else {
          let lines = source.split(/\r?\n/);
          let coverage = new Array(lines.length).fill(null);
          for (let lineData of record.lines.data) coverage[lineData.lineNumber - 1] = lineData.executionCount;

          let filename = path.relative(process.cwd(), record.sourceFile);
          let digest = crypto.createHash('md5').update(source).digest('hex');
          resolve(new SourceFile(filename, digest, source, coverage));
        }
      });
    }));

    return Promise.all(promises).then(sourceFiles => new Job(sourceFiles));
  }

  /**
   * Updates the properties of the specified job using the given configuration parameters.
   * @param {Job} job The job to update.
   * @param {Configuration} config The parameters to define.
   */
  _updateJob(job, config) {
    let hasGitData = config.keys.some(key => key == 'service_branch' || key.substr(0, 4) == 'git_');
    if (!hasGitData) job.commitSha = config.containsKey('commit_sha') ? config.get('commit_sha') : '';
    else {
      let commit = new GitCommit(
        config.containsKey('commit_sha') ? config.get('commit_sha') : '',
        config.containsKey('git_message') ? config.get('git_message') : ''
      );

      commit.authorEmail = config.containsKey('git_author_email') ? config.get('git_author_email') : '';
      commit.authorName = config.containsKey('git_author_name') ? config.get('git_author_name') : '';
      commit.committerEmail = config.containsKey('git_committer_email') ? config.get('git_committer_email') : '';
      commit.committerName = config.containsKey('git_committer_email') ? config.get('git_committer_email') : '';

      job.git = new GitData(commit, config.containsKey('service_branch') ? config.get('service_branch') : '');
    }

    if (config.containsKey('repo_token')) job.repoToken = config.get('repo_token');
    else if (config.containsKey('repo_secret_token')) job.repoToken = config.get('repo_secret_token');

    job.isParallel = config.get('parallel') == 'true';
    job.runAt = config.containsKey('run_at') ? new Date(config.get('run_at')) : null;
    job.serviceJobId = config.containsKey('service_job_id') ? config.get('service_job_id') : '';
    job.serviceName = config.containsKey('service_name') ? config.get('service_name') : '';
    job.serviceNumber = config.containsKey('service_number') ? config.get('service_number') : '';
    job.servicePullRequest = config.containsKey('service_pull_request') ? config.get('service_pull_request') : '';
  }
}