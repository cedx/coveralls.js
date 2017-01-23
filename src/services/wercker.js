import {Configuration} from '../configuration';

/**
 * Gets the [Wercker](http://www.wercker.com) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    git_branch: process.env.WERCKER_GIT_BRANCH,
    git_commit: process.env.WERCKER_GIT_COMMIT,
    service_job_id: process.env.WERCKER_BUILD_ID,
    service_name: 'wercker'
  });
}
