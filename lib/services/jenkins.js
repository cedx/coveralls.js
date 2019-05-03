import {Configuration} from '../configuration.js';

/**
 * Gets the [Jenkins](https://jenkins.io) configuration parameters from the environment.
 * @param {Object<string, string>} env A map providing environment variables.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration(env) {
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
