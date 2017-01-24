import {Configuration} from '../configuration';

/**
 * Gets the [CircleCI](https://circleci.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    commit_sha: process.env.CIRCLE_SHA1,
    parallel: parseInt(process.env.CIRCLE_NODE_TOTAL, 10) > 1 ? 'true' : 'false',
    service_branch: process.env.CIRCLE_BRANCH,
    service_build_url: process.env.CIRCLE_BUILD_URL,
    service_job_number: process.env.CIRCLE_NODE_INDEX,
    service_name: 'circleci',
    service_number: process.env.CIRCLE_BUILD_NUM
  });
}
