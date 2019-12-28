/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../json';

/**
 * Gets the [Semaphore](https://semaphoreci.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment: StringMap): Configuration {
  return new Configuration({
    commit_sha: environment.REVISION,
    service_branch: environment.BRANCH_NAME,
    service_name: 'semaphore',
    service_number: environment.SEMAPHORE_BUILD_NUMBER,
    service_pull_request: environment.PULL_REQUEST_NUMBER
  });
}
