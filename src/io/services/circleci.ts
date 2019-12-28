/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../json';

/**
 * Gets the [CircleCI](https://circleci.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment: StringMap): Configuration {
  return new Configuration({
    commit_sha: environment.CIRCLE_SHA1,
    parallel: 'CIRCLE_NODE_TOTAL' in environment ? (Number.parseInt(environment.CIRCLE_NODE_TOTAL!, 10) > 1 ? 'true' : 'false') : 'false',
    service_branch: environment.CIRCLE_BRANCH,
    service_build_url: environment.CIRCLE_BUILD_URL,
    service_job_number: environment.CIRCLE_NODE_INDEX,
    service_name: 'circleci',
    service_number: environment.CIRCLE_BUILD_NUM
  });
}
