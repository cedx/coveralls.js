/* eslint-disable @typescript-eslint/camelcase */
import { Configuration } from '../configuration.js';
/**
 * Gets the [Jenkins](https://jenkins.io) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment) {
    return new Configuration({
        commit_sha: environment.GIT_COMMIT,
        service_branch: environment.GIT_BRANCH,
        service_build_url: environment.BUILD_URL,
        service_job_id: environment.BUILD_ID,
        service_name: 'jenkins',
        service_number: environment.BUILD_NUMBER,
        service_pull_request: environment.ghprbPullId
    });
}
