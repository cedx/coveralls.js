/* eslint-disable @typescript-eslint/camelcase */
import { Configuration } from '../configuration.js';
/**
 * Gets the [Semaphore](https://semaphoreci.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env) {
    return new Configuration({
        commit_sha: env.REVISION,
        service_branch: env.BRANCH_NAME,
        service_name: 'semaphore',
        service_number: env.SEMAPHORE_BUILD_NUMBER,
        service_pull_request: env.PULL_REQUEST_NUMBER
    });
}
