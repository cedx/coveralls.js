/* eslint-disable @typescript-eslint/camelcase */
import { Configuration } from '../configuration.js';
/**
 * Gets the [GitLab CI](https://gitlab.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment) {
    return new Configuration({
        commit_sha: environment.CI_BUILD_REF,
        service_branch: environment.CI_BUILD_REF_NAME,
        service_job_id: environment.CI_BUILD_ID,
        service_job_number: environment.CI_BUILD_NAME,
        service_name: 'gitlab-ci'
    });
}
