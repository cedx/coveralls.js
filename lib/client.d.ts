/// <reference types="node" />
import { EventEmitter } from "events";
import { Configuration } from "./configuration.js";
import { Job } from "./job.js";
/** An exception caused by an error in a [[Client]] request. */
export declare class ClientError extends Error {
    readonly uri?: URL | undefined;
    /**
     * Creates a new client error.
     * @param message A message describing the error.
     * @param uri The URL of the HTTP request or response that failed.
     */
    constructor(message?: string, uri?: URL | undefined);
}
/** Uploads code coverage reports to the [Coveralls](https://coveralls.io) service. */
export declare class Client extends EventEmitter {
    endPoint: URL;
    /** The URL of the default API end point. */
    static readonly defaultEndPoint: URL;
    /**
     * An event that is triggered when a request is made to the remote service.
     * @event request
     */
    static readonly eventRequest: string;
    /**
     * An event that is triggered when a response is received from the remote service.
     * @event response
     */
    static readonly eventResponse: string;
    /**
     * Creates a new client.
     * @param endPoint The URL of the API end point.
     */
    constructor(endPoint?: URL);
    /**
     * Uploads the specified code coverage report to the Coveralls service.
     * Rejects with a `TypeError` if the specified coverage report is empty or invalid.
     * @param coverage A coverage report.
     * @param config The environment settings.
     * @return Completes when the operation is done.
     */
    upload(coverage: string, config?: Configuration): Promise<void>;
    /**
     * Uploads the specified job to the Coveralls service.
     *
     * Rejects with a [[ClientError]] if an error occurred while uploading the report.
     * Rejects with a `TypeError` if the specified job does not meet the requirements.
     *
     * @param job The job to be uploaded.
     * @return Completes when the operation is done.
     */
    uploadJob(job: Job): Promise<void>;
    /**
     * Updates the properties of the specified job using the given configuration parameters.
     * @param job The job to update.
     * @param config The parameters to define.
     */
    private _updateJob;
}
