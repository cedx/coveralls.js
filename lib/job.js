const {GitData} = require('./git.js');
const {SourceFile} = require('./source_file.js');

/**
 * Represents a Git remote repository.
 */
class Job {

  /**
   * Initializes a new instance of the class.
   * @param {Object} [options] An object specifying values used to initialize this instance.
   */
  constructor({repoToken = '', serviceJobId = '', serviceName = '', sourceFiles = []} = {}) {

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
    this.isParallel = false;

    /**
     * The secret token for the repository.
     * @type {string}
     */
    this.repoToken = repoToken;

    /**
     * The timestamp of when the job ran.
     * @type {Date}
     */
    this.runAt = null;

    /**
     * The unique identifier of the job on the CI service.
     * @type {string}
     */
    this.serviceJobId = serviceJobId;

    /**
     * The CI service or other environment in which the test suite was run.
     * @type {string}
     */
    this.serviceName = serviceName;

    /**
     * The build number.
     * @type {string}
     */
    this.serviceNumber = '';

    /**
     * The associated pull request identifier of the build.
     * @type {string}
     */
    this.servicePullRequest = '';

    /**
     * The list of source files.
     * @type {SourceFile[]}
     */
    this.sourceFiles = sourceFiles;
  }

  /**
   * The class name.
   * @type {string}
   */
  get [Symbol.toStringTag]() {
    return 'Job';
  }

  /**
   * Creates a new job from the specified JSON map.
   * @param {Object} map A JSON map representing a job.
   * @return {Job} The instance corresponding to the specified JSON map, or `null` if a parsing error occurred.
   */
  static fromJson(map) {
    if (!map || typeof map != 'object') return null;

    let job = new this({
      repoToken: typeof map.repo_token == 'string' ? map.repo_token : '',
      serviceJobId: typeof map.service_job_id == 'string' ? map.service_job_id : '',
      serviceName: typeof map.service_name == 'string' ? map.service_name : '',
      sourceFiles: Array.isArray(map.source_files) ? map.source_files.map(item => SourceFile.fromJson(item)).filter(item => item != null) : []
    });

    job.commitSha = typeof map.commit_sha == 'string' ? map.commit_sha : '';
    job.git = GitData.fromJson(map.git);
    job.isParallel = typeof map.parallel == 'boolean' ? map.parallel : false;
    job.runAt = typeof map.run_at == 'string' ? new Date(map.run_at) : null;
    job.serviceNumber = typeof map.service_number == 'string' ? map.service_number : '';
    job.servicePullRequest = typeof map.service_pull_request == 'string' ? map.service_pull_request : '';

    return job;
  }

  /**
   * Converts this object to a map in JSON format.
   * @return {Object} The map in JSON format corresponding to this object.
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
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

// Module exports.
exports.Job = Job;