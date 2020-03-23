import { Configuration } from '../configuration';
import { StringMap } from '../json';
/**
 * Gets the [Travis CI](https://travis-ci.com) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export declare function getConfiguration(env: StringMap): Configuration;