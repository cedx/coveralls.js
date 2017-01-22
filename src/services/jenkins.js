/**
 * Gets the [Jenkins](https://jenkins.io) configuration parameters from the environment.
 * @return {object} The configuration parameters.
 */
export function getConfiguration() {
  return {
    git_branch: process.env.GIT_BRANCH,
    git_commit: process.env.GIT_COMMIT,
    service_job_id: process.env.BUILD_ID,
    service_name: 'jenkins',
    service_pull_request: process.env.ghprbPullId
  };
}
