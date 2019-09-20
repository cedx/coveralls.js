import {which} from '@cedx/which';
import EventEmitter from 'events';
import FormData from 'form-data';
import fetch from 'node-fetch';

import {Configuration} from './configuration';
import {RequestEvent, ResponseEvent} from './events';
import {GitCommit, GitData} from './git';
import {Job} from './job';

/** An exception caused by an error in a [[Client]] request. */
export class ClientError extends Error {

  /**
   * Creates a new client error.
   * @param message A message describing the error.
   * @param uri The URL of the HTTP request or response that failed.
   */
  constructor(message: string = '', readonly uri?: URL) {
    super(message);
    this.name = 'ClientError';
  }
}

/** Uploads code coverage reports to the [Coveralls](https://coveralls.io) service. */
export class Client extends EventEmitter {

  /** The URL of the default API end point. */
  static readonly defaultEndPoint: URL = new URL('https://coveralls.io/api/v1/');

  /**
   * An event that is triggered when a request is made to the remote service.
   * @event request
   */
  static readonly eventRequest: string = 'request';

  /**
   * An event that is triggered when a response is received from the remote service.
   * @event response
   */
  static readonly eventResponse: string = 'response';

  /**
   * Creates a new client.
   * @param endPoint The URL of the API end point.
   */
  constructor(public endPoint: URL = Client.defaultEndPoint) {
    super();
  }

  /**
   * Uploads the specified code coverage report to the Coveralls service.
   * Rejects with a [[TypeError]] if the specified coverage report is empty or invalid.
   * @param coverage A coverage report.
   * @param configuration The environment settings.
   * @return Completes when the operation is done.
   */
  async upload(coverage: string, configuration?: Configuration): Promise<void> {
    const report = coverage.trim();
    if (!report.length) throw new TypeError('The specified coverage report is empty.');

    let job;
    if (report.startsWith('<?xml') || report.startsWith('<coverage')) {
      const {parseReport} = await import('./parsers/clover');
      job = await parseReport(report);
    }
    else if (report.startsWith('TN:') || report.startsWith('SF:')) {
      const {parseReport} = await import('./parsers/lcov');
      job = await parseReport(report);
    }

    if (!job) throw new TypeError('The specified coverage format is not supported.');
    console.log(job.toJSON());
    this._updateJob(job, configuration ? configuration : await Configuration.loadDefaults());
    if (!job.runAt) job.runAt = new Date;

    try {
      await which('git');
      const git = await GitData.fromRepository();
      const branch = job.git ? job.git.branch : '';
      if (git.branch == 'HEAD' && branch.length) git.branch = branch;
      if (job.serviceName == 'github') for (const remote of git.remotes)
        if (remote.url && !remote.url.href.endsWith('.git')) remote.url = new URL(`${remote.url.href}.git`);

      job.git = git;
    }

    catch { /* Noop */ }
    console.log(job.toJSON());
    return this.uploadJob(job);
  }

  /**
   * Uploads the specified job to the Coveralls service.
   *
   * Rejects with a [[ClientError]] if an error occurred while uploading the report.
   * Rejects with a [[TypeError]] if the specified job does not meet the requirements.
   *
   * @param job The job to be uploaded.
   * @return Completes when the operation is done.
   */
  async uploadJob(job: Job): Promise<void> {
    if (!job.repoToken.length && !job.serviceName.length) throw new TypeError('The job does not meet the requirements.');

    const url = new URL('jobs', this.endPoint);
    const body = new FormData;
    body.append('json_file', Buffer.from(JSON.stringify(job)), 'coveralls.json');

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore: `fetch` has wrong typings.
    const request = new fetch.Request(url.href, {method: 'POST', body});
    this.emit(Client.eventRequest, new RequestEvent(request));

    let response;
    try { response = await fetch(request); }
    catch (err) { throw new ClientError(err.message, url); }

    this.emit(Client.eventResponse, new ResponseEvent(response, request));
    if (!response.ok) throw new ClientError(`${response.status} ${response.statusText} ${await response.text()}`, url);
      // TODO throw new ClientError('An error occurred while uploading the report.', url);
  }

  /**
   * Updates the properties of the specified job using the given configuration parameters.
   * @param job The job to update.
   * @param config The parameters to define.
   */
  private _updateJob(job: Job, config: Configuration): void {
    if (config.has('repo_token')) job.repoToken = config.get('repo_token')!;
    else if (config.has('repo_secret_token')) job.repoToken = config.get('repo_secret_token')!;

    if (config.has('parallel')) job.isParallel = config.get('parallel') == 'true';
    if (config.has('run_at')) job.runAt = new Date(config.get('run_at')!);
    if (config.has('service_job_id')) job.serviceJobId = config.get('service_job_id')!;
    if (config.has('service_name')) job.serviceName = config.get('service_name')!;
    if (config.has('service_number')) job.serviceNumber = config.get('service_number')!;
    if (config.has('service_pull_request')) job.servicePullRequest = config.get('service_pull_request')!;

    const hasGitData = config.keys.some(key => key == 'service_branch' || key.startsWith('git_'));
    if (!hasGitData) job.commitSha = config.has('commit_sha') ? config.get('commit_sha')! : '';
    else {
      const commit = new GitCommit(config.has('commit_sha') ? config.get('commit_sha')! : '', {
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
