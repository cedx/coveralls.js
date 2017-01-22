/**
 * Gets the [Travis CI](https://travis-ci.com) configuration parameters from the environment.
 * @return {object} The configuration parameters.
 */
export function getConfiguration() {
  return {
    git_branch: process.env.TRAVIS_BRANCH,
    git_commit: 'HEAD',
    service_job_id: process.env.TRAVIS_JOB_ID,
    service_name: 'travis-ci'
  };
}
