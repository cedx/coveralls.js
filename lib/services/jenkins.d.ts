import { Configuration } from '../configuration';
import { StringMap } from '../json';
/**
 * Gets the [Jenkins](https://jenkins.io) configuration parameters from the environment.
 * @param env A map providing environment variables.
 * @return The configuration parameters.
 */
export declare function getConfiguration(env: StringMap): Configuration;
