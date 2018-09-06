import {GitData} from './git';
import {JsonMap} from './map';
import {SourceFile} from './source_file';

/**
 * Represents the coverage data from a single run of a test suite.
 */
export class Job {

  /**
   * The current SHA of the commit being built to override the `git` parameter.
   */
  commitSha: string = '';

  /**
   * The Git data that can be used to display more information to users.
   */
  git: GitData | null = null;

  /**
   * Value indicating whether the build will not be considered done until a webhook has been sent to Coveralls.
   */
  isParallel: boolean = false;

  /**
   * The secret token for the repository.
   */
  repoToken: string;

  /**
   * The timestamp of when the job ran.
   */
  runAt: Date | null = null;

  /**
   * The unique identifier of the job on the CI service.
   */
  serviceJobId: string;

  /**
   * The CI service or other environment in which the test suite was run.
   */
  serviceName: string;

  /**
   * The build number.
   */
  serviceNumber: string = '';

  /**
   * The associated pull request identifier of the build.
   */
  servicePullRequest: string = '';

  /**
   * The list of source files.
   */
  sourceFiles: SourceFile[];

  /**
   * Creates a new job.
   * @param options An object specifying values used to initialize this instance.
   */
  constructor(options: Partial<JobOptions> = {}) {
    const {repoToken = '', serviceJobId = '', serviceName = '', sourceFiles = []} = options;
    this.repoToken = repoToken;
    this.serviceJobId = serviceJobId;
    this.serviceName = serviceName;
    this.sourceFiles = sourceFiles;
  }

  /**
   * The class name.
   */
  get [Symbol.toStringTag](): string {
    return 'Job';
  }

  /**
   * Creates a new job from the specified JSON map.
   * @param map A JSON map representing a job.
   * @return The instance corresponding to the specified JSON map.
   */
  static fromJson(map: JsonMap): Job {
    const job = new this({
      repoToken: typeof map.repo_token == 'string' ? map.repo_token : '',
      serviceJobId: typeof map.service_job_id == 'string' ? map.service_job_id : '',
      serviceName: typeof map.service_name == 'string' ? map.service_name : '',
      sourceFiles: Array.isArray(map.source_files) ? map.source_files.map(item => SourceFile.fromJson(item)) : []
    });

    job.commitSha = typeof map.commit_sha == 'string' ? map.commit_sha : '';
    job.git = typeof map.git == 'object' && map.git ? GitData.fromJson(map.git) : null;
    job.isParallel = typeof map.parallel == 'boolean' ? map.parallel : false;
    job.runAt = typeof map.run_at == 'string' ? new Date(map.run_at) : null;
    job.serviceNumber = typeof map.service_number == 'string' ? map.service_number : '';
    job.servicePullRequest = typeof map.service_pull_request == 'string' ? map.service_pull_request : '';

    return job;
  }

  /**
   * Converts this object to a map in JSON format.
   * @return The map in JSON format corresponding to this object.
   */
  toJSON(): JsonMap {
    const map: JsonMap = {};

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
   * @return The string representation of this object.
   */
  toString(): string {
    return `${this[Symbol.toStringTag]} ${JSON.stringify(this)}`;
  }
}

/**
 * Defines the options of a `Job` instance.
 */
export interface JobOptions {

  /**
   * The secret token for the repository.
   */
  repoToken: string;

  /**
   * The unique identifier of the job on the CI service.
   */
  serviceJobId: string;

  /**
   * The CI service or other environment in which the test suite was run.
   */
  serviceName: string;

  /**
   * The list of source files.
   */
  sourceFiles: SourceFile[];
}
