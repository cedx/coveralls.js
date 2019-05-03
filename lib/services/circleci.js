import {Configuration} from '../configuration.js';

/**
 * Gets the [CircleCI](https://circleci.com) configuration parameters from the environment.
 * @param {Object<string, string>} env A map providing environment variables.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration(env) {
  return new Configuration({
    commit_sha: env.CIRCLE_SHA1,
    parallel: 'CIRCLE_NODE_TOTAL' in env ? (Number.parseInt(env.CIRCLE_NODE_TOTAL) > 1 ? 'true' : 'false') : 'false',
    service_branch: env.CIRCLE_BRANCH,
    service_build_url: env.CIRCLE_BUILD_URL,
    service_job_number: env.CIRCLE_NODE_INDEX,
    service_name: 'circleci',
    service_number: env.CIRCLE_BUILD_NUM
  });
}
