import {Configuration} from '../configuration';
import {StringMap} from '../map';

/**
 * Gets the [Wercker](http://www.wercker.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  return new Configuration({
    commit_sha: env.WERCKER_GIT_COMMIT,
    service_branch: env.WERCKER_GIT_BRANCH,
    service_job_id: env.WERCKER_BUILD_ID,
    service_name: 'wercker'
  });
}
