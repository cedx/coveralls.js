import {Configuration} from '../configuration.js';
import {StringMap} from '../json.js';

/**
 * Gets the [Solano CI](https://ci.solanolabs.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  const serviceNumber = env.TDDIUM_SESSION_ID;
  return new Configuration({
    service_branch: env.TDDIUM_CURRENT_BRANCH,
    service_build_url: serviceNumber ? `https://ci.solanolabs.com/reports/${serviceNumber}` : undefined,
    service_job_number: env.TDDIUM_TID,
    service_name: 'tddium',
    service_number: serviceNumber,
    service_pull_request: env.TDDIUM_PR_ID
  });
}
