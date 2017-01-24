import {Configuration} from '../configuration';

/**
 * Gets the [GitLab CI](https://gitlab.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    commit_sha: process.env.CI_BUILD_REF,
    service_branch: process.env.CI_BUILD_REF_NAME,
    service_job_id: process.env.CI_BUILD_ID,
    service_job_number: process.env.CI_BUILD_NAME,
    service_name: 'gitlab-ci'
  });
}
