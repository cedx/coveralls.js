import { GitData } from "./git.js";
import { JsonObject } from "./json.js";
import { SourceFile } from "./source_file.js";
/** Represents the coverage data from a single run of a test suite. */
export declare class Job {
    /** The current SHA of the commit being built to override the `git` parameter. */
    commitSha: string;
    /** The job name. */
    flagName: string;
    /** The Git data that can be used to display more information to users. */
    git?: GitData;
    /** Value indicating whether the build will not be considered done until a webhook has been sent to Coveralls. */
    isParallel: boolean;
    /** The secret token for the repository. */
    repoToken: string;
    /** The timestamp of when the job ran. */
    runAt?: Date;
    /** The unique identifier of the job on the CI service. */
    serviceJobId: string;
    /** The CI service or other environment in which the test suite was run. */
    serviceName: string;
    /** The build number. */
    serviceNumber: string;
    /** The associated pull request identifier of the build. */
    servicePullRequest: string;
    /** The list of source files. */
    sourceFiles: SourceFile[];
    /**
     * Creates a new job.
     * @param options An object specifying values used to initialize this instance.
     */
    constructor(options?: Partial<JobOptions>);
    /**
     * Creates a new job from the specified JSON object.
     * @param map A JSON object representing a job.
     * @return The instance corresponding to the specified JSON object.
     */
    static fromJson(map: JsonObject): Job;
    /**
     * Converts this object to a map in JSON format.
     * @return The map in JSON format corresponding to this object.
     */
    toJSON(): JsonObject;
}
/** Defines the options of a [[Job]] instance. */
export interface JobOptions {
    /** The secret token for the repository. */
    repoToken: string;
    /** The unique identifier of the job on the CI service. */
    serviceJobId: string;
    /** The CI service or other environment in which the test suite was run. */
    serviceName: string;
    /** The list of source files. */
    sourceFiles: SourceFile[];
}
