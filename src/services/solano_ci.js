import {Configuration} from '../configuration';

/**
 * Gets the [Solano CI](https://ci.solanolabs.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  let serviceNumber = process.env.TDDIUM_SESSION_ID;
  return new Configuration({
    service_branch: process.env.TDDIUM_CURRENT_BRANCH,
    service_build_url: `https://ci.solanolabs.com/reports/${serviceNumber}`,
    service_job_number: process.env.TDDIUM_TID,
    service_name: 'tddium',
    service_number: $serviceNumber,
    service_pull_request: process.env.TDDIUM_PR_ID
  });
}
