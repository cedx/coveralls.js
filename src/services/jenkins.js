import {Configuration} from '../configuration';

/**
 * Gets the [Jenkins](https://jenkins.io) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    commit_sha: process.env.GIT_COMMIT,
    service_branch: process.env.GIT_BRANCH,
    service_build_url: process.env.BUILD_URL,
    service_job_id: process.env.BUILD_ID,
    service_name: 'jenkins',
    service_number: process.env.BUILD_NUMBER,
    service_pull_request: process.env.ghprbPullId
  });
}
