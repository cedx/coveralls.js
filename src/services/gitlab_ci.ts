/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration.js';
import {StringMap} from '../json.js';

/**
 * Gets the [GitLab CI](https://gitlab.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  return new Configuration({
    commit_sha: env.CI_BUILD_REF,
    service_branch: env.CI_BUILD_REF_NAME,
    service_job_id: env.CI_BUILD_ID,
    service_job_number: env.CI_BUILD_NAME,
    service_name: 'gitlab-ci'
  });
}
