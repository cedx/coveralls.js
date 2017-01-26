import {Configuration} from '../configuration';

/**
 * Gets the [GitLab CI](https://gitlab.com) configuration parameters from the environment.
 * @param {object} env A map providing environment variables.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration(env) {
  return new Configuration({
    commit_sha: env.CI_BUILD_REF,
    service_branch: env.CI_BUILD_REF_NAME,
    service_job_id: env.CI_BUILD_ID,
    service_job_number: env.CI_BUILD_NAME,
    service_name: 'gitlab-ci'
  });
}
