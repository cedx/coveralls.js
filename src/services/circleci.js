/**
 * Gets the [CircleCI](https://circleci.com) configuration parameters from the environment.
 * @return {object} The configuration parameters.
 */
export function getConfiguration() {
  let map = {
    git_branch: process.env.CIRCLE_BRANCH,
    git_commit: process.env.CIRCLE_SHA1,
    service_job_id: process.env.CIRCLE_BUILD_NUM,
    service_name: 'circleci'
  };

  if ('CI_PULL_REQUEST' in process.env) {
    let pullRequest = process.env.CI_PULL_REQUEST.split('/pull/');
    if (pullRequest.length >= 2) map.service_pull_request = pullRequest[1];
  }

  return map;
}
