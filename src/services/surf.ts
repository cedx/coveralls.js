/* eslint-disable @typescript-eslint/camelcase */
import {Configuration} from '../configuration.js';
import {StringMap} from '../json.js';

/**
 * Gets the [Surf](https://github.com/surf-build/surf) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(env: StringMap): Configuration {
  return new Configuration({
    commit_sha: env.SURF_SHA1,
    service_branch: env.SURF_REF,
    service_name: 'surf'
  });
}
