/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../json';

/**
 * Gets the [Solano CI](https://ci.solanolabs.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment: StringMap): Configuration {
  const serviceNumber = environment.TDDIUM_SESSION_ID;
  return new Configuration({
    service_branch: environment.TDDIUM_CURRENT_BRANCH,
    service_build_url: serviceNumber ? `https://ci.solanolabs.com/reports/${serviceNumber}` : undefined,
    service_job_number: environment.TDDIUM_TID,
    service_name: 'tddium',
    service_number: serviceNumber,
    service_pull_request: environment.TDDIUM_PR_ID
  });
}
