const {which} = require('@cedx/which');
const EventEmitter = require('events');
const FormData = require('form-data');
const fetch = require('node-fetch');

const {Configuration} = require('./configuration.js');
const {GitCommit, GitData} = require('./git.js');

/**
 * An exception caused by an error in a `Client` request.
 */
class ClientError extends Error {

  /**
   * Creates a new client error.
   * @param {string} message A message describing the error.
   * @param {string|URL} [uri] The URL of the HTTP request or response that failed.
   */
  constructor(message, uri) {
    super(message);

    /**
     * The error name.
     * @type {string}
     */
    this.name = 'ClientError';

    /**
     * The URL of the HTTP request or response that failed.
     * @type {URL}
     */
    this.uri = typeof uri == 'string' ? new URL(uri) : uri;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    let values = `"${this.message}"`;
    if (this.uri) values = `${values}, uri: "${this.uri.href}"`;
    return `${this.name}(${values})`;
  }
}

/**
 * Uploads code coverage reports to the [Coveralls](https://coveralls.io) service.
 */
class Client extends EventEmitter {

  /**
   * The URL of the default API end point.
   * @type {URL}
   */
  static get defaultEndPoint() {
    return new URL('https://coveralls.io');
  }

  /**
   * Initializes a new instance of the class.
   * @param {string|URL} [endPoint] The URL of the API end point.
   */
  constructor(endPoint = Client.defaultEndPoint) {
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
   * @return {Promise} Completes when the operation is done.
   * @emits {fetch~Request} The "request" event.
   * @emits {fetch~Response} The "response" event.
   */
  async upload(coverage, configuration = null) {
    let report = coverage.trim();
    if (!report.length) throw new TypeError('The specified coverage report is empty.');

    let job;
    if (report.substring(0, 5) == '<?xml' || report.substring(0, 10) == '<coverage') {
      const {parseReport} = require('./parsers/clover.js');
      job = await parseReport(report);
    }
    else {
      let token = report.substring(0, 3);
      if (token == 'TN:' || token == 'SF:') {
        const {parseReport} = require('./parsers/lcov.js');
        job = await parseReport(report);
      }
    }

    if (!job) throw new TypeError('The specified coverage format is not supported.');
    this._updateJob(job, configuration ? configuration : await Configuration.loadDefaults());
    if (!job.runAt) job.runAt = new Date;

    try {
      if ((await which('git')).length) {
        let git = await GitData.fromRepository();
        let branch = job.git ? job.git.branch : '';
        if (git.branch == 'HEAD' && branch.length) git.branch = branch;
        job.git = git;
      }
    }

    catch (err) { /* Noop */ }
    return this.uploadJob(job);
  }

  /**
   * Uploads the specified job to the Coveralls service.
   * @param {Job} job The job to be uploaded.
   * @return {Promise} Completes when the operation is done.
   * @emits {fetch~Request} The "request" event.
   * @emits {fetch~Response} The "response" event.
   */
  async uploadJob(job) {
    if (!job.repoToken.length && !job.serviceName.length) throw new TypeError('The job does not meet the requirements.');

    let body = new FormData;
    body.append('json_file', Buffer.from(JSON.stringify(job)), 'coveralls.json');

    let req = new fetch.Request(new URL('api/v1/jobs', this.endPoint).href, {method: 'POST', body});
    this.emit('request', req);

    let res = await fetch(req);
    this.emit('response', res);

    if (!res.ok) throw new ClientError('An error occurred while uploading the report.');
    return res.text();
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
      let commit = new GitCommit(config.has('commit_sha') ? config.get('commit_sha') : '', {
        authorEmail: config.has('git_author_email') ? config.get('git_author_email') : '',
        authorName: config.has('git_author_name') ? config.get('git_author_name') : '',
        committerEmail: config.has('git_committer_email') ? config.get('git_committer_email') : '',
        committerName: config.has('git_committer_email') ? config.get('git_committer_email') : '',
        message: config.has('git_message') ? config.get('git_message') : ''
      });

      job.git = new GitData(commit, {branch: config.has('service_branch') ? config.get('service_branch') : ''});
    }
  }
}

// Module exports.
exports.Client = Client;
