'use strict';

const {Report, Token} = require('@cedx/lcov');
const {which} = require('@cedx/which');
const {createHash} = require('crypto');
const EventEmitter = require('events');
const FormData = require('form-data');
const {readFile} = require('fs');
const {default: fetch, Request} = require('node-fetch');
const {relative} = require('path');
const {Observable, Subject} = require('rxjs');
const {URL} = require('url');

const {Configuration} = require('./configuration');
const {GitCommit} = require('./git_commit');
const {GitData} = require('./git_data');
const {Job} = require('./job');
const {SourceFile} = require('./source_file');

/**
 * Uploads code coverage reports to the [Coveralls](https://coveralls.io) service.
 */
exports.Client = class Client extends EventEmitter {

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
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Client';
  }

  /**
   * Uploads the specified code coverage report to the Coveralls service.
   * @param {string} coverage A coverage report.
   * @param {Configuration} [configuration] The environment settings.
   * @return {Observable} Completes when the operation is done.
   * @emits {Request} The "request" event.
   * @emits {Response} The "response" event.
   */
  upload(coverage, configuration = null) {
    coverage = coverage.trim();
    if (!coverage.length) return Observable.throw(new Error('The specified coverage report is empty.'));

    let token = coverage.substr(0, 3);
    if (token != `${Token.TEST_NAME}:` && token != `${Token.SOURCE_FILE}:`)
      return Observable.throw(new Error('The specified coverage format is not supported.'));

    let observables = [
      this._parseReport(coverage),
      configuration ? Observable.of(configuration) : Configuration.loadDefaults(),
      which('git').catch(() => Observable.of(''))
        .mergeMap(gitPath => gitPath.length ? GitData.fromRepository() : Observable.of(null))
    ];

    return Observable.zip(...observables).mergeMap(results => {
      let [job, config, git] = results;
      this._updateJob(job, config);
      if (!job.runAt) job.runAt = new Date;

      if (git) {
        let branch = job.git ? job.git.branch : '';
        if (git.branch == 'HEAD' && branch.length) git.branch = branch;
        job.git = git;
      }

      return this.uploadJob(job);
    });
  }

  /**
   * Uploads the specified job to the Coveralls service.
   * @param {Job} job The job to be uploaded.
   * @return {Observable} Completes when the operation is done.
   * @emits {Request} The "request" event.
   * @emits {Response} The "response" event.
   */
  uploadJob(job) {
    if (!job.repoToken.length && !job.serviceName.length)
      return Observable.throw(new Error('The job does not meet the requirements.'));

    let body = new FormData;
    body.append('json_file', Buffer.from(JSON.stringify(job)), 'coveralls.json');

    let req = new Request(new URL('api/v1/jobs', this.endPoint).href, {method: 'POST', body});
    this._onRequest.next(req);

    return Observable.from(fetch(req)).mergeMap(res => {
      this._onResponse.next(res);
      return res.ok ? Observable.from(res.text()) : Observable.throw(new Error(`${res.status} ${res.statusText}`));
    });
  }

  /**
   * Parses the specified [LCOV](http://ltp.sourceforge.net/coverage/lcov.php) coverage report.
   * @param {string} report A coverage report in LCOV format.
   * @return {Observable<Job>} The job corresponding to the specified coverage report.
   */
  _parseReport(report) {
    let workingDir = process.cwd();

    const loadFile = Observable.bindNodeCallback(readFile);
    let records = Report.fromCoverage(report).records;
    let observables = records.map(record => loadFile(record.sourceFile, 'utf8'));

    return Observable.zip(...observables).map(results => new Job(results.map((source, index) => {
      let record = records[index];
      let lines = source.split(/\r?\n/);
      let coverage = new Array(lines.length).fill(null);
      for (let lineData of record.lines.data) coverage[lineData.lineNumber - 1] = lineData.executionCount;

      let filename = relative(workingDir, record.sourceFile);
      let digest = createHash('md5').update(source).digest('hex');
      return new SourceFile(filename, digest, source, coverage);
    })));
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
};
