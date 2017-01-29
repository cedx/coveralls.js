import {Configuration} from './configuration';
import {GitCommit} from './git_commit';
import {GitData} from './git_data';
import {SourceFile} from './source_file';

/**
 * Represents a Git remote repository.
 */
export class Job {

  /**
   * Initializes a new instance of the class.
   * @param {Configuration} [config] The remote's name.
   * @param {SourceFile[]} [sourceFiles] The remote's URL.
   */
  constructor(config = null, sourceFiles = []) {
    if (!config) config = new Configuration();

    /**
     * The current SHA of the commit being built to override the `git` parameter.
     * @type {string}
     */
    this.commitSha = '';

    /**
     * The Git data that can be used to display more information to users.
     * @type {GitData}
     */
    this.git = null;

    /**
     * Value indicating whether the build will not be considered done until a webhook has been sent to Coveralls.
     * @type {boolean}
     */
    this.isParallel = config.containsKey('parallel') ? config.get('parallel') == 'true' : false;

    /**
     * The secret token for the repository.
     * @type {string}
     */
    this.repoToken = '';
    if (config.containsKey('repo_token')) this.repoToken = config.get('repo_token');
    else if (config.containsKey('repo_secret_token')) this.repoToken = config.get('repo_secret_token');

    /**
     * The timestamp of when the job ran.
     * @type {Date}
     */
    this.runAt = config.containsKey('run_at') ? new Date(config.get('run_at')) : null;

    /**
     * The unique identifier of the job on the CI service.
     * @type {string}
     */
    this.serviceJobId = config.containsKey('service_job_id') ? config.get('service_job_id') : '';

    /**
     * The CI service or other environment in which the test suite was run.
     * @type {string}
     */
    this.serviceName = config.containsKey('service_name') ? config.get('service_name') : '';

    /**
     * The build number.
     * @type {string}
     */
    this.serviceNumber = config.containsKey('service_number') ? config.get('service_number') : '';

    /**
     * The associated pull request identifier of the build.
     * @type {string}
     */
    this.servicePullRequest = config.containsKey('service_pull_request') ? config.get('service_pull_request') : '';

    /**
     * The list of source files.
     * @type {SourceFile[]}
     */
    this.sourceFiles = sourceFiles;

    // Initialize the instance from the specified configuration.
    let hasGitData = config.keys.some(key => key == 'service_branch' || key.substr(0, 4) == 'git_');
    if (!hasGitData) this.commitSha = config.containsKey('commit_sha') ? config.get('commit_sha') : '';
    else {
      let commit = new GitCommit(
        config.containsKey('commit_sha') ? config.get('commit_sha') : '',
        config.containsKey('git_message') ? config.get('git_message') : ''
      );

      commit.authorEmail = config.containsKey('git_author_email') ? config.get('git_author_email') : '';
      commit.authorName = config.containsKey('git_author_name') ? config.get('git_author_name') : '';
      commit.committerEmail = config.containsKey('git_committer_email') ? config.get('git_committer_email') : '';
      commit.committerName = config.containsKey('git_committer_email') ? config.get('git_committer_email') : '';

      this.git = new GitData(commit, config.containsKey('service_branch') ? config.get('service_branch') : '');
    }
  }

  /**
   * Creates a new job from the specified JSON map.
   * @param {object} map A JSON map representing a job.
   * @return {Job} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJSON(map) {
    return !map || typeof map != 'object' ? null : new Job(
      new Configuration(map),
      Array.isArray(map.source_files) ? map.source_files.map(item => SourceFile.fromJSON(item)).filter(item => item) : []
    );
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {object} The map in JSON format corresponding to this object.
   */
  toJSON() {
    let map = {};

    if (this.repoToken.length) map.repo_token = this.repoToken;
    if (this.serviceName.length) map.service_name = this.serviceName;
    if (this.serviceNumber.length) map.service_number = this.serviceNumber;
    if (this.serviceJobId.length) map.service_job_id = this.serviceJobId;
    if (this.servicePullRequest.length) map.service_pull_request = this.servicePullRequest;

    map.source_files = this.sourceFiles.map(item => item.toJSON());
    if (this.isParallel) map.parallel = true;
    if (this.git) map.git = this.git.toJSON();
    if (this.commitSha.length) map.commit_sha = this.commitSha;
    if (this.runAt) map.run_at = this.runAt.toISOString();

    return map;
  }

  /**
   * Returns a string representation of this object.
   * @return {string} The string representation of this object.
   */
  toString() {
    return `this.{this.constructor.name} ${JSON.stringify(this)}`;
  }
}
