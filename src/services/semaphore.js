import {Configuration} from '../configuration';

/**
 * Gets the [Semaphore](https://semaphoreci.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    commit_sha: process.env.REVISION,
    service_branch: process.env.BRANCH_NAME,
    service_name:  'semaphore',
    service_number: process.env.SEMAPHORE_BUILD_NUMBER,
    service_pull_request: process.env.PULL_REQUEST_NUMBER
  });
}
