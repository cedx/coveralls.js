/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration';
import {StringMap} from '../json';

/**
 * Gets the [Codeship](https://codeship.com) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment: StringMap): Configuration {
  return new Configuration({
    commit_sha: environment.CI_COMMIT_ID,
    git_committer_email: environment.CI_COMMITTER_EMAIL,
    git_committer_name: environment.CI_COMMITTER_NAME,
    git_message: environment.CI_COMMIT_MESSAGE,
    service_job_id: environment.CI_BUILD_NUMBER,
    service_name: 'codeship'
  });
}
