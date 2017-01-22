/**
 * Gets the [Wercker](http://www.wercker.com) configuration parameters from the environment.
 * @return {object} The configuration parameters.
 */
export function getConfiguration() {
  return {
    git_branch: process.env.WERCKER_GIT_BRANCH,
    git_commit: process.env.WERCKER_GIT_COMMIT,
    service_job_id: process.env.WERCKER_BUILD_ID,
    service_name: 'wercker'
  };
}
