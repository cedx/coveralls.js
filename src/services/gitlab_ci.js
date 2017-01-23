import {Configuration} from '../configuration';

/**
 * Gets the [GitLab CI](https://gitlab.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    git_branch: process.env.CI_BUILD_REF_NAME,
    git_commit: process.env.CI_BUILD_REF,
    service_job_id: process.env.CI_BUILD_ID,
    service_job_number: process.env.CI_BUILD_NAME,
    service_name: 'gitlab-ci'
  });
}
