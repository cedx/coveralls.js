/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration.js';
import {StringMap} from '../json.js';

/**
 * Gets the [Jenkins](https://jenkins.io) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  return new Configuration({
    commit_sha: env.GIT_COMMIT,
    service_branch: env.GIT_BRANCH,
    service_build_url: env.BUILD_URL,
    service_job_id: env.BUILD_ID,
    service_name: 'jenkins',
    service_number: env.BUILD_NUMBER,
    service_pull_request: env.ghprbPullId
  });
}
