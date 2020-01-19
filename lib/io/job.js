import { GitData } from './git.js';
import { SourceFile } from './source_file.js';
/** Represents the coverage data from a single run of a test suite. */
export class Job {
    /**
     * Creates a new job.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(options = {}) {
        /** The current SHA of the commit being built to override the `git` parameter. */
        this.commitSha = '';
        /** The job name. */
        this.flagName = '';
        /** Value indicating whether the build will not be considered done until a webhook has been sent to Coveralls. */
        this.isParallel = false;
        /** The build number. */
        this.serviceNumber = '';
        /** The associated pull request identifier of the build. */
        this.servicePullRequest = '';
        const { repoToken = '', serviceJobId = '', serviceName = '', sourceFiles = [] } = options;
        this.repoToken = repoToken;
        this.serviceJobId = serviceJobId;
        this.serviceName = serviceName;
        this.sourceFiles = sourceFiles;
    }
    /**
     * Creates a new job from the specified JSON object.
     * @param map A JSON object representing a job.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map) {
        const job = new Job({
            repoToken: typeof map.repo_token == 'string' ? map.repo_token : '',
            serviceJobId: typeof map.service_job_id == 'string' ? map.service_job_id : '',
            serviceName: typeof map.service_name == 'string' ? map.service_name : '',
            sourceFiles: Array.isArray(map.source_files) ? map.source_files.map(item => SourceFile.fromJson(item)) : []
        });
        job.commitSha = typeof map.commit_sha == 'string' ? map.commit_sha : '';
        job.flagName = typeof map.flag_name == 'string' ? map.flag_name : '';
        job.git = typeof map.git == 'object' && map.git ? GitData.fromJson(map.git) : undefined;
        job.isParallel = typeof map.parallel == 'boolean' ? map.parallel : false;
        job.runAt = typeof map.run_at == 'string' ? new Date(map.run_at) : undefined;
        job.serviceNumber = typeof map.service_number == 'string' ? map.service_number : '';
        job.servicePullRequest = typeof map.service_pull_request == 'string' ? map.service_pull_request : '';
        return job;
    }
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON() {
        const map = {};
        /* eslint-disable @typescript-eslint/camelcase */
        if (this.commitSha.length)
            map.commit_sha = this.commitSha;
        if (this.flagName.length)
            map.flag_name = this.flagName;
        if (this.git)
            map.git = this.git.toJSON();
        if (this.isParallel)
            map.parallel = true;
        if (this.repoToken.length)
            map.repo_token = this.repoToken;
        if (this.runAt)
            map.run_at = this.runAt.toISOString();
        if (this.serviceName.length)
            map.service_name = this.serviceName;
        if (this.serviceNumber.length)
            map.service_number = this.serviceNumber;
        if (this.serviceJobId.length)
            map.service_job_id = this.serviceJobId;
        if (this.servicePullRequest.length)
            map.service_pull_request = this.servicePullRequest;
        map.source_files = this.sourceFiles.map(item => item.toJSON());
        /* eslint-enable @typescript-eslint/camelcase */
        return map;
    }
}
