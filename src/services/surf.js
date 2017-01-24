import {Configuration} from '../configuration';

/**
 * Gets the [Surf](https://github.com/surf-build/surf) configuration parameters from the environment.
 * @return {Configuration} The configuration parameters.
 */
export function getConfiguration() {
  return new Configuration({
    commit_sha: process.env.SURF_SHA1,
    service_branch: process.env.SURF_REF,
    service_name: 'surf'
  });
}
