import {Configuration} from '../configuration';

/**
 * Gets the [Codeship](https://codeship.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    commit_sha: process.env.CI_COMMIT_ID,
    git_committer_email: process.env.CI_COMMITTER_EMAIL,
    git_committer_name: process.env.CI_COMMITTER_NAME,
    git_message: process.env.CI_COMMIT_MESSAGE,
    service_branch: process.env.CI_BRANCH,
    service_job_id: process.env.CI_BUILD_NUMBER,
    service_name: 'codeship'
  });
}
