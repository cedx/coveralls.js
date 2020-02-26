/* eslint-disable @typescript-eslint/camelcase */
import { Configuration } from '../configuration.js';
/**
 * Gets the [Surf](https://github.com/surf-build/surf) configuration parameters from the environment.
 * @param environment A map providing environment variables.
 * @return The configuration parameters.
 */
export function getConfiguration(environment) {
    return new Configuration({
        commit_sha: environment.SURF_SHA1,
        service_branch: environment.SURF_REF,
        service_name: 'surf'
    });
}