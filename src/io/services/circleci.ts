/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../map';

/**
 * Gets the [CircleCI](https://circleci.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  return new Configuration({
    commit_sha: env.CIRCLE_SHA1,
    parallel: 'CIRCLE_NODE_TOTAL' in env ? (Number.parseInt(env.CIRCLE_NODE_TOTAL!, 10) > 1 ? 'true' : 'false') : 'false',
    service_branch: env.CIRCLE_BRANCH,
    service_build_url: env.CIRCLE_BUILD_URL,
    service_job_number: env.CIRCLE_NODE_INDEX,
    service_name: 'circleci',
    service_number: env.CIRCLE_BUILD_NUM
  });
}
