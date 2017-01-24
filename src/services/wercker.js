import {Configuration} from '../configuration';

/**
 * Gets the [Wercker](http://www.wercker.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    commit_sha: process.env.WERCKER_GIT_COMMIT,
    service_branch: process.env.WERCKER_GIT_BRANCH,
    service_job_id: process.env.WERCKER_BUILD_ID,
    service_name: 'wercker'
  });
}
