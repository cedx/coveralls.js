/* eslint-disable @typescript-eslint/camelcase */
import { Configuration } from '../configuration.js';
/**
 * Gets the [Wercker](https://app.wercker.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment) {
    return new Configuration({
        commit_sha: environment.WERCKER_GIT_COMMIT,
        service_branch: environment.WERCKER_GIT_BRANCH,
        service_job_id: environment.WERCKER_BUILD_ID,
        service_name: 'wercker'
    });
}
